#!/usr/bin/env python3
"""
Files Example for Mix Python SDK

Documentation Reference: docs/sdks/files/README.md

This example demonstrates comprehensive file management functionality including:
- File upload operations with different content types (text, image, binary)
- File listing with metadata display and filtering
- Thumbnail generation and retrieval for images
- File download with various options and error handling
- Session-based file isolation and management
- File deletion and cleanup operations

Run this example to see all files methods in action.
"""

from mix_python_sdk import Mix
import os
from dotenv import load_dotenv


def demonstrate_session_creation_and_cleanup(mix):
    """Demonstrate session creation for file operations"""
    print("\n=== Session Creation Demo ===")

    print("1. Creating a new session for file operations...")
    session = mix.sessions.create(title="Files Example Session")
    print(f"Created session: {session.id}")
    print(f"Session title: {session.title}")

    return session


def demonstrate_file_upload_operations(mix, session_id):
    """Demonstrate file upload with different content types"""
    print("\n=== File Upload Operations Demo ===")

    # Load real files from sample_files directory
    sample_dir = "examples/sample_files"
    print(f"1. Loading real files from {sample_dir}...")

    uploaded_files = []

    # Check for text file (required)
    text_file_path = os.path.join(sample_dir, "sample.txt")
    if not os.path.exists(text_file_path):
        raise FileNotFoundError(
            f"Required sample text file not found at {text_file_path}. Please add a sample.txt file to the examples/sample_files/ directory."
        )

    print(f"2. Uploading text file: {text_file_path}")
    with open(text_file_path, "rb") as f:
        text_file_info = mix.files.upload_session_file(
            id=session_id,
            file={
                "file_name": "sample.txt",
                "content": f,
                "content_type": "text/plain",
            },
        )
    print(f"Uploaded text file: {text_file_info.name}")
    print(f"File size: {text_file_info.size} bytes")
    print(f"Modified: {text_file_info.modified}")
    print(f"Is directory: {text_file_info.is_dir}")
    uploaded_files.append(text_file_info)

    # Check for image file (required - try common extensions)
    image_extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"]
    image_uploaded = False
    for ext in image_extensions:
        image_file_path = os.path.join(sample_dir, f"sample{ext}")
        if os.path.exists(image_file_path):
            print(f"3. Uploading image file: {image_file_path}")
            with open(image_file_path, "rb") as f:
                # Determine content type based on extension
                content_type = f"image/{ext[1:]}" if ext != ".jpg" else "image/jpeg"
                image_file_info = mix.files.upload_session_file(
                    id=session_id,
                    file={
                        "file_name": f"sample{ext}",
                        "content": f,
                        "content_type": content_type,
                    },
                )
            print(f"Uploaded image file: {image_file_info.name}")
            print(f"File size: {image_file_info.size} bytes")
            uploaded_files.append(image_file_info)
            image_uploaded = True
            break

    if not image_uploaded:
        raise FileNotFoundError(
            f"Required sample image file not found in {sample_dir}. Please add a sample image file (sample.jpg, sample.png, etc.) to the examples/sample_files/ directory."
        )

    return uploaded_files


def demonstrate_file_listing_and_metadata(mix, session_id):
    """Demonstrate file listing with metadata display"""
    print("\n=== File Listing and Metadata Demo ===")

    print("1. Listing all files in the session...")
    files = mix.files.list_session_files(id=session_id)
    print(f"Found {len(files)} files in session")

    print("\n2. Detailed file metadata:")
    for file_info in files:
        print(f"\n--- File: {file_info.name} ---")
        print(f"  Size: {file_info.size} bytes")
        print(f"  Modified: {file_info.modified}")
        print(f"  Is directory: {file_info.is_dir}")

        print("  All attributes:")
        for key, value in file_info.__dict__.items():
            print(f"    {key}: {value}")

    return files


def demonstrate_file_download_operations(mix, session_id, files):
    """Demonstrate file download with various options"""
    print("\n=== File Download Operations Demo ===")

    for file_info in files:
        print(f"\n1. Downloading file: {file_info.name}")

        # Basic download
        file_response = mix.files.get_session_file(
            id=session_id, filename=file_info.name
        )
        print(f"Download response status: {file_response.status_code}")
        print(f"Content type: {file_response.headers.get('content-type', 'unknown')}")
        print(
            f"Content length: {file_response.headers.get('content-length', 'unknown')}"
        )

        # Read first few bytes to verify content
        content = file_response.read()
        if len(content) > 0:
            preview = content[:50] if len(content) > 50 else content
            try:
                preview_str = preview.decode("utf-8", errors="ignore")
                print(f"Content preview: {repr(preview_str)}")
            except Exception:
                print(f"Binary content preview: {preview[:20]}...")


def demonstrate_thumbnail_generation(mix, session_id, uploaded_files):
    """Demonstrate thumbnail generation for images"""
    print("\n=== Thumbnail Generation Demo ===")

    # Find an image file from uploaded files
    image_file = None
    for file_info in uploaded_files:
        if any(
            ext in file_info.name.lower()
            for ext in [".jpg", ".jpeg", ".png", ".gif", ".bmp"]
        ):
            image_file = file_info
            break

    if not image_file:
        print("❌ No image file available for thumbnail generation")
        return

    print(f"1. Using uploaded image for thumbnail generation: {image_file.name}")

    # Test different thumbnail options
    thumbnail_specs = [
        ("100", "100x100 box thumbnail"),
        ("w200", "Width-constrained to 200px"),
        ("h150", "Height-constrained to 150px"),
    ]

    for thumb_spec, description in thumbnail_specs:
        print(f"\n2. Generating {description}...")
        thumbnail_response = mix.files.get_session_file(
            id=session_id, filename=image_file.name, thumb=thumb_spec
        )
        print(f"Thumbnail response status: {thumbnail_response.status_code}")
        print(
            f"Thumbnail content type: {thumbnail_response.headers.get('content-type', 'unknown')}"
        )
        content = thumbnail_response.read()
        print(f"Thumbnail size: {len(content)} bytes")


def demonstrate_file_deletion_and_cleanup(mix, session_id, files):
    """Demonstrate file deletion and cleanup operations"""
    print("\n=== File Deletion and Cleanup Demo ===")

    print("1. Current files before deletion:")
    current_files = mix.files.list_session_files(id=session_id)
    for file_info in current_files:
        print(f"  - {file_info.name} ({file_info.size} bytes)")

    # Filter out system files and directories that shouldn't be deleted
    user_files = [
        f
        for f in current_files
        if not f.is_dir
        and not f.name.startswith(".")
        and f.name in ["sample.txt", "sample.jpg", "sample.png"]
    ]

    print(
        "\n2. Deleting user uploaded files (excluding system files and directories)..."
    )
    for file_info in user_files:
        print(f"Deleting {file_info.name}...")
        mix.files.delete_session_file(id=session_id, filename=file_info.name)
        print(f"✅ Deleted {file_info.name}")

    print("\n3. Files remaining after deletion:")
    remaining_files = mix.files.list_session_files(id=session_id)
    for file_info in remaining_files:
        print(f"  - {file_info.name} ({file_info.size} bytes)")

    print("\n4. Final verification:")
    user_files_remaining = [
        f for f in remaining_files if not f.is_dir and not f.name.startswith(".")
    ]
    print(f"User files remaining: {len(user_files_remaining)}")
    if len(user_files_remaining) == 0:
        print("✅ All user files successfully deleted")
    else:
        print("❌ Some user files remain:")
        for file_info in user_files_remaining:
            print(f"  - {file_info.name}")


def demonstrate_session_isolation(mix):
    """Demonstrate session-based file isolation"""
    print("\n=== Session Isolation Demo ===")

    print("1. Creating two separate sessions...")
    session1 = mix.sessions.create(title="Session 1 - File Isolation Test")
    session2 = mix.sessions.create(title="Session 2 - File Isolation Test")
    print(f"Session 1 ID: {session1.id}")
    print(f"Session 2 ID: {session2.id}")

    print("\n2. Uploading file to Session 1...")
    with open("examples/sample_files/sample.txt", "rb") as f:
        mix.files.upload_session_file(
            id=session1.id,
            file={
                "file_name": "session1_file.txt",
                "content": f,
                "content_type": "text/plain",
            },
        )

    print("3. Uploading file to Session 2...")
    with open("examples/sample_files/sample.txt", "rb") as f:
        mix.files.upload_session_file(
            id=session2.id,
            file={
                "file_name": "session2_file.txt",
                "content": f,
                "content_type": "text/plain",
            },
        )

    print("\n4. Verifying file isolation...")
    files1 = mix.files.list_session_files(id=session1.id)
    files2 = mix.files.list_session_files(id=session2.id)

    print(f"Session 1 files: {[f.name for f in files1]}")
    print(f"Session 2 files: {[f.name for f in files2]}")

    if len(files1) == 1 and len(files2) == 1:
        if files1[0].name != files2[0].name:
            print("✅ File isolation working correctly")
        else:
            print("❌ File isolation may not be working")

    print("\n5. Cleaning up isolation test sessions...")
    mix.sessions.delete(id=session1.id)
    mix.sessions.delete(id=session2.id)
    print("✅ Test sessions deleted")


def main():
    """Main function demonstrating Mix SDK files functionality"""
    load_dotenv()

    server_url = os.getenv("MIX_SERVER_URL", "http://localhost:8088")

    print("=" * 60)
    print("MIX PYTHON SDK - FILES EXAMPLE")
    print("=" * 60)
    print(f"Server URL: {server_url}")
    print("This example demonstrates all files functionality")
    print("Using session-based file isolation and management")
    print("=" * 60)

    with Mix(server_url=server_url) as mix:
        # Always start with system health check
        health = mix.system.get_health()
        print(f"System health: {health}")

        # Create session for file operations
        session = demonstrate_session_creation_and_cleanup(mix)

        try:
            # Demonstrate all file operations
            uploaded_files = demonstrate_file_upload_operations(mix, session.id)
            demonstrate_file_listing_and_metadata(mix, session.id)
            demonstrate_file_download_operations(mix, session.id, uploaded_files)
            demonstrate_thumbnail_generation(mix, session.id, uploaded_files)
            demonstrate_file_deletion_and_cleanup(mix, session.id, uploaded_files)

            # Demonstrate session isolation
            demonstrate_session_isolation(mix)

        finally:
            # Clean up the main session
            print("\n=== Final Cleanup ===")
            print(f"Deleting main session: {session.id}")
            mix.sessions.delete(id=session.id)
            print("✅ Main session deleted")


if __name__ == "__main__":
    main()
