def chunk_text(
    text: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 150,
) -> list[str]:
    if not text.strip():
        return []

    if chunk_overlap >= chunk_size:
        raise ValueError(
            "chunk_overlap must be smaller than chunk_size"
        )

    words = text.split()

    chunks = []

    start = 0

    while start < len(words):
        end = min(
            start + chunk_size,
            len(words),
        )

        chunk = " ".join(
            words[start:end]
        ).strip()

        if chunk:
            chunks.append(chunk)

        if end >= len(words):
            break

        start = end - chunk_overlap

    return chunks
