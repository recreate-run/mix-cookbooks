"""Utility functions for Mix Python examples."""

from pathlib import Path
from urllib.parse import urlparse
import httpx


async def upload_to_storage(mix, session_id, file_url, content_type="video/mp4"):
    """
    Download file from a URL and upload to Supabase storage.

    Args:
        mix: Mix client instance
        session_id: Session ID
        file_url: URL of the file to download (e.g., from session storage)
        content_type: MIME type of the file (default: video/mp4)

    Returns:
        FileInfo object with uploaded file details, or None if failed
    """
    # Extract filename from URL
    parsed_url = urlparse(file_url)
    filename = Path(parsed_url.path).name

    # Download file from URL
    async with httpx.AsyncClient() as client:
        response = await client.get(file_url)
        if response.status_code != 200:
            print(f"⚠️  Failed to download: {file_url}")
            return None

    # Upload to Supabase storage
    file_info = mix.files.upload_session_file(
        id=session_id,
        file={
            "file_name": filename,
            "content": response.content,
            "content_type": content_type,
        },
    )
    print(f"✅ Uploaded to Supabase: {file_info.url}")
    return file_info
