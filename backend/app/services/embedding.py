# backend/app/services/embedding.py
import os
import numpy as np
# pyrefly: ignore [missing-import]
import onnxruntime as ort
# pyrefly: ignore [missing-import]
from tokenizers import Tokenizer

class ONNXEmbeddingModel:
    def __init__(self, model_dir: str):
        model_path = os.path.join(model_dir, "model.onnx")
        tokenizer_path = os.path.join(model_dir, "tokenizer.json")
        
        if not os.path.exists(model_path) or not os.path.exists(tokenizer_path):
            raise FileNotFoundError(
                f"Model files not found in {model_dir}. Please run download_model.py first."
            )
            
        # Initialize Tokenizer
        self.tokenizer = Tokenizer.from_file(tokenizer_path)
        self.tokenizer.enable_truncation(max_length=256)
        self.tokenizer.enable_padding(pad_id=0, pad_token="[PAD]")
        
        # Initialize ONNX Runtime Session (CPU only)
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 1
        opts.inter_op_num_threads = 1
        opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        self.session = ort.InferenceSession(model_path, sess_options=opts, providers=['CPUExecutionProvider'])

    def encode(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
            
        # Encode batch of texts
        encoded = self.tokenizer.encode_batch(texts)
        
        input_ids = [e.ids for e in encoded]
        attention_mask = [e.attention_mask for e in encoded]
        token_type_ids = [e.type_ids for e in encoded]
        
        input_ids_np = np.array(input_ids, dtype=np.int64)
        attention_mask_np = np.array(attention_mask, dtype=np.int64)
        token_type_ids_np = np.array(token_type_ids, dtype=np.int64)
        
        # Prepare inputs dynamically based on ONNX signature
        model_inputs = [i.name for i in self.session.get_inputs()]
        onnx_inputs = {}
        if "input_ids" in model_inputs:
            onnx_inputs["input_ids"] = input_ids_np
        if "attention_mask" in model_inputs:
            onnx_inputs["attention_mask"] = attention_mask_np
        if "token_type_ids" in model_inputs:
            onnx_inputs["token_type_ids"] = token_type_ids_np
            
        # Run inference session
        outputs = self.session.run(None, onnx_inputs)
        token_embeddings = outputs[0]  # Shape: (batch_size, seq_len, 384)
        
        # Apply mean pooling
        sentence_embeddings = self._mean_pooling(token_embeddings, attention_mask_np)
        
        # Apply L2 Normalization (so vector cosine operator yields exact similarity)
        norms = np.linalg.norm(sentence_embeddings, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1e-12, norms)
        normalized_embeddings = sentence_embeddings / norms
        
        return normalized_embeddings.tolist()
        
    def _mean_pooling(self, token_embeddings, attention_mask):
        input_mask_expanded = np.expand_dims(attention_mask, axis=-1).astype(float)
        sum_embeddings = np.sum(token_embeddings * input_mask_expanded, axis=1)
        sum_mask = np.sum(input_mask_expanded, axis=1)
        sum_mask = np.clip(sum_mask, a_min=1e-9, a_max=None)
        return sum_embeddings / sum_mask
