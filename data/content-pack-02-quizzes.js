window.ENGLISH_RADAR_CONTENT_PACK_02_QUIZZES = [
  {
    "id": "cp02-retrieval-meaning",
    "signalId": "ai-retrieval",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A system receives a user question, searches an indexed knowledge base, and returns the most relevant passages before an LLM writes the answer. Which step is retrieval?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Writing the final natural-language answer"
      },
      {
        "id": "b",
        "text": "Finding and returning the relevant passages"
      },
      {
        "id": "c",
        "text": "Fine-tuning the model weights"
      },
      {
        "id": "d",
        "text": "Counting the model's tokens"
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Retrieval finds relevant content from an existing information source; writing the final answer is generation.",
    "explanationZh": "Retrieval 的职责是从已有信息源中找回相关内容；生成最终回答属于 generation。"
  },
  {
    "id": "cp02-retrieval-boundary",
    "signalId": "ai-retrieval",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "A search system has already returned 30 candidate passages. Another model then reorders those 30 passages so the strongest evidence appears first. What is the second step?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Retrieval"
      },
      {
        "id": "b",
        "text": "Reranking"
      },
      {
        "id": "c",
        "text": "Chunking"
      },
      {
        "id": "d",
        "text": "Fine-tuning"
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Retrieval gets candidate content; reranking reorders an already retrieved candidate set.",
    "explanationZh": "Retrieval 负责取得候选内容；Reranking 在已有候选结果上再次排序。"
  },
  {
    "id": "cp02-embedding-meaning",
    "signalId": "ai-embedding",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A developer converts each support article into a numerical vector so semantically similar questions can be matched to it. What is that vector representation called?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "A token"
      },
      {
        "id": "b",
        "text": "An embedding"
      },
      {
        "id": "c",
        "text": "A prompt"
      },
      {
        "id": "d",
        "text": "A release"
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "An embedding is a numerical vector representation used to capture relationships such as semantic similarity.",
    "explanationZh": "Embedding 是内容的数值向量表示，可用于相似性比较和语义检索。"
  },
  {
    "id": "cp02-embedding-boundary",
    "signalId": "ai-embedding",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "Which statement is most accurate?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "One embedding always equals one English word."
      },
      {
        "id": "b",
        "text": "A token and an embedding are identical names for the same text unit."
      },
      {
        "id": "c",
        "text": "Tokens are processing units produced by tokenization, while embeddings are numerical vector representations."
      },
      {
        "id": "d",
        "text": "Embeddings are readable summaries generated for users."
      }
    ],
    "correctOptionId": "c",
    "explanationEn": "Tokens and embeddings are different layers: tokens are discrete text-processing units, while embeddings are numerical vector representations.",
    "explanationZh": "Token 与 Embedding 属于不同层级：前者是文本处理单位，后者是机器可比较的向量表示。"
  },
  {
    "id": "cp02-chunking-meaning",
    "signalId": "ai-chunking",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A 200-page manual is split into smaller passages so each passage can be embedded and retrieved separately. What is this preparation step called?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Chunking"
      },
      {
        "id": "b",
        "text": "Fine-tuning"
      },
      {
        "id": "c",
        "text": "Reranking"
      },
      {
        "id": "d",
        "text": "Deployment"
      }
    ],
    "correctOptionId": "a",
    "explanationEn": "Chunking splits larger content into smaller units that can be independently processed, embedded, indexed, or retrieved.",
    "explanationZh": "Chunking 是把较大的内容拆成多个可独立处理和检索的小块。"
  },
  {
    "id": "cp02-chunking-boundary",
    "signalId": "ai-chunking",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "Which statement is most accurate?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Chunking always rewrites a document into a shorter summary."
      },
      {
        "id": "b",
        "text": "Every RAG system must use exactly the same chunk size."
      },
      {
        "id": "c",
        "text": "Chunking splits content into smaller units; the useful size and overlap depend on the content and retrieval setup."
      },
      {
        "id": "d",
        "text": "One chunk always contains exactly one token."
      }
    ],
    "correctOptionId": "c",
    "explanationEn": "Chunking is a splitting process, not summarization, and useful chunk size and overlap depend on the content and retrieval setup.",
    "explanationZh": "Chunking 是切分流程，不等于摘要；实际 chunk size 和 overlap 需要按使用场景确定。"
  },
  {
    "id": "cp02-vector-database-meaning",
    "signalId": "ai-vector-database",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A team needs to store thousands of document embeddings and efficiently retrieve nearby vectors for semantic search. Which component best fits?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "A vector database"
      },
      {
        "id": "b",
        "text": "A tokenizer"
      },
      {
        "id": "c",
        "text": "A release branch"
      },
      {
        "id": "d",
        "text": "A prompt template"
      }
    ],
    "correctOptionId": "a",
    "explanationEn": "A vector database or vector store is designed around storing, indexing, and querying vector representations for similarity-based retrieval.",
    "explanationZh": "Vector database / vector store 主要围绕向量的存储、索引与相似性检索设计。"
  },
  {
    "id": "cp02-vector-database-boundary",
    "signalId": "ai-vector-database",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "Which statement is most accurate?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Every RAG system must use a standalone vector database."
      },
      {
        "id": "b",
        "text": "A vector database generates the original embeddings by definition."
      },
      {
        "id": "c",
        "text": "Vector databases are designed to store and query vectors, but RAG can also use other retrieval architectures."
      },
      {
        "id": "d",
        "text": "Vector databases can only store plain English sentences and no metadata."
      }
    ],
    "correctOptionId": "c",
    "explanationEn": "Vector databases are a common retrieval implementation, but RAG can use other search systems, hybrid retrieval, or vector capabilities in existing databases.",
    "explanationZh": "向量数据库是常见实现方式，但不是 RAG 的唯一检索基础设施。"
  },
  {
    "id": "cp02-similarity-search-meaning",
    "signalId": "ai-similarity-search",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A user asks “How do I recover my account?” The document says “Restore access to your profile,” with few exact keyword matches, but the vector representations are close. Which search method is designed to use that closeness?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Similarity search"
      },
      {
        "id": "b",
        "text": "Release tagging"
      },
      {
        "id": "c",
        "text": "Fine-tuning"
      },
      {
        "id": "d",
        "text": "Chunking"
      }
    ],
    "correctOptionId": "a",
    "explanationEn": "Similarity search uses closeness between vector representations to retrieve semantically similar content even when exact words differ.",
    "explanationZh": "Similarity search 根据向量表示之间的接近程度寻找语义相似内容，不要求关键词完全一致。"
  },
  {
    "id": "cp02-similarity-search-boundary",
    "signalId": "ai-similarity-search",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "Which statement is most accurate?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "The highest similarity score proves the result is factually correct."
      },
      {
        "id": "b",
        "text": "Similarity search can retrieve semantically close candidates, while keyword search or reranking may also contribute to the final result."
      },
      {
        "id": "c",
        "text": "Similarity search and keyword search are always identical."
      },
      {
        "id": "d",
        "text": "Similarity search changes model weights during training."
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Vector similarity is one retrieval signal, not proof of factual correctness; real systems may combine keyword, hybrid search, and reranking.",
    "explanationZh": "向量相似性是一种检索信号，不是事实正确性的保证；现实系统也常结合 keyword / hybrid search 与 reranking。"
  },
  {
    "id": "cp02-query-meaning",
    "signalId": "ai-query",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A user types “How do I restore my account?” The system uses that input to search an index for relevant documents. In the retrieval layer, what is the input called?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Query"
      },
      {
        "id": "b",
        "text": "Release"
      },
      {
        "id": "c",
        "text": "Chunk"
      },
      {
        "id": "d",
        "text": "Inference endpoint"
      }
    ],
    "correctOptionId": "a",
    "explanationEn": "In a search or retrieval workflow, a query is the input request used to match against indexed content.",
    "explanationZh": "在搜索 / retrieval 流程中，query 是提交给系统用于匹配内容的查询请求。"
  },
  {
    "id": "cp02-query-boundary",
    "signalId": "ai-query",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "Which statement is most accurate?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Query and prompt are always different strings."
      },
      {
        "id": "b",
        "text": "A query usually plays a search or retrieval role, while a prompt is input to a generative model; one user message can sometimes serve both roles."
      },
      {
        "id": "c",
        "text": "A prompt can only contain one word."
      },
      {
        "id": "d",
        "text": "Query means the final generated answer."
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Query and prompt are best distinguished by their role in the workflow, not by whether the text strings are always different.",
    "explanationZh": "两者主要区别在工作流中的角色，而不是一定由不同文字构成。"
  },
  {
    "id": "cp02-reranking-meaning",
    "signalId": "ai-reranking",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A retrieval system already has 50 candidate documents. A second model scores those candidates again and moves the most relevant ones to the top. What is this step?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Chunking"
      },
      {
        "id": "b",
        "text": "Reranking"
      },
      {
        "id": "c",
        "text": "Fine-tuning"
      },
      {
        "id": "d",
        "text": "Tokenization"
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Reranking applies a second relevance signal to an already retrieved candidate set and reorders the results.",
    "explanationZh": "Reranking 是在已有候选结果上进行第二轮评分和排序。"
  },
  {
    "id": "cp02-reranking-boundary",
    "signalId": "ai-reranking",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "Which statement is most accurate?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Reranking means searching the entire corpus from scratch again."
      },
      {
        "id": "b",
        "text": "Retrieval gets candidate results; reranking can reorder those candidates based on a second relevance signal."
      },
      {
        "id": "c",
        "text": "Retrieval and reranking are identical names for model training."
      },
      {
        "id": "d",
        "text": "Reranking changes the documents stored in the database."
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Retrieval and reranking are consecutive but distinct stages: retrieval obtains candidates and reranking reorders those candidates.",
    "explanationZh": "两者是连续但不同的检索步骤：先取候选，再二次排序。"
  },
  {
    "id": "cp02-token-meaning",
    "signalId": "ai-token",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A model tokenizer splits the word “unbelievable” into multiple smaller units before processing it. What are those processing units called?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Tokens"
      },
      {
        "id": "b",
        "text": "Releases"
      },
      {
        "id": "c",
        "text": "Vector databases"
      },
      {
        "id": "d",
        "text": "Deployments"
      }
    ],
    "correctOptionId": "a",
    "explanationEn": "Tokens are the discrete text units produced by tokenization and processed by the model.",
    "explanationZh": "Token 是 tokenizer 切分后交给模型处理的离散文本单位。"
  },
  {
    "id": "cp02-token-boundary",
    "signalId": "ai-token",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "Which statement is most accurate?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "One token always equals exactly one English word."
      },
      {
        "id": "b",
        "text": "Tokens can be whole words, parts of words, punctuation, or other character sequences depending on the tokenizer."
      },
      {
        "id": "c",
        "text": "Tokens are always numerical embeddings with hundreds of dimensions."
      },
      {
        "id": "d",
        "text": "Tokenization changes a model's trained weights."
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Tokens do not map one-to-one to natural-language words; their boundaries depend on the tokenizer and the text.",
    "explanationZh": "Token 与自然语言“单词”不是固定一一对应关系。"
  },
  {
    "id": "cp02-inference-meaning",
    "signalId": "ai-inference",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A trained model receives a new customer message and predicts its category without updating its weights. What stage is this?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Inference"
      },
      {
        "id": "b",
        "text": "Fine-tuning"
      },
      {
        "id": "c",
        "text": "Pretraining"
      },
      {
        "id": "d",
        "text": "Chunking"
      }
    ],
    "correctOptionId": "a",
    "explanationEn": "Inference uses a trained model to process new inputs and produce predictions or outputs without training the model on that request.",
    "explanationZh": "Inference 是训练完成后使用模型处理新输入并产生预测或输出。"
  },
  {
    "id": "cp02-inference-boundary",
    "signalId": "ai-inference",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "Which statement is most accurate?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Inference normally means updating model weights with a training dataset."
      },
      {
        "id": "b",
        "text": "Training learns or updates parameters; inference uses a trained model to process new inputs."
      },
      {
        "id": "c",
        "text": "Inference is another name for vector storage."
      },
      {
        "id": "d",
        "text": "Training and inference are always the same runtime operation."
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Training learns or updates model parameters; inference uses the trained model to process new input.",
    "explanationZh": "Training 与 inference 最核心的区别是“继续学习参数”与“使用已有参数运行模型”。"
  },
  {
    "id": "cp02-fine-tuning-meaning",
    "signalId": "ai-fine-tuning",
    "questionType": "meaning",
    "difficulty": "easy",
    "context": "A team starts with a pretrained model and continues training it on a smaller labeled dataset for customer-support classification. What is this process?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "Retrieval"
      },
      {
        "id": "b",
        "text": "Fine-tuning"
      },
      {
        "id": "c",
        "text": "Reranking"
      },
      {
        "id": "d",
        "text": "Similarity search"
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Fine-tuning continues training a pretrained model on a smaller, specialized dataset for task or domain adaptation.",
    "explanationZh": "Fine-tuning 是在已有 pretrained model 上继续进行针对性训练。"
  },
  {
    "id": "cp02-fine-tuning-boundary",
    "signalId": "ai-fine-tuning",
    "questionType": "boundary",
    "difficulty": "hard",
    "context": "Which statement is most accurate?",
    "prompt": "Choose the best answer.",
    "options": [
      {
        "id": "a",
        "text": "RAG and fine-tuning are identical because both always change model weights."
      },
      {
        "id": "b",
        "text": "Fine-tuning continues model training, while RAG retrieves external information at runtime without requiring that information to be trained into the model."
      },
      {
        "id": "c",
        "text": "Adding documents to a vector database automatically fine-tunes the model."
      },
      {
        "id": "d",
        "text": "Changing a system prompt is always fine-tuning."
      }
    ],
    "correctOptionId": "b",
    "explanationEn": "Fine-tuning changes model parameters through additional training; RAG retrieves external information at runtime and does not require that information to be trained into the model.",
    "explanationZh": "两者属于不同层级：Fine-tuning 改变训练后的模型参数；RAG 主要在运行时引入检索内容。"
  }
];
