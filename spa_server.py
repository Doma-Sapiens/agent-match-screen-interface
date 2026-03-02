#!/usr/bin/env python3
from __future__ import annotations

import argparse
import http.server
import os
from pathlib import Path
import socketserver


class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    """Serve static files; fallback to index.html for client-side routes."""

    def __init__(self, *args, directory: str | None = None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def send_head(self):
        path = self.translate_path(self.path)

        if os.path.isdir(path):
            for index in ("index.html", "index.htm"):
                index_path = os.path.join(path, index)
                if os.path.exists(index_path):
                    self.path = self.path.rstrip("/") + "/" + index
                    return super().send_head()

        if os.path.exists(path):
            return super().send_head()

        # SPA fallback
        self.path = "/index.html"
        return super().send_head()


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=8090)
    p.add_argument("--bind", default="0.0.0.0")
    p.add_argument(
        "--root",
        default=str((Path(__file__).resolve().parent / "build").resolve()),
        help="Directory to serve (defaults to ./build)",
    )
    args = p.parse_args()

    root = Path(args.root).resolve()

    handler = lambda *h_args, **h_kwargs: SPARequestHandler(
        *h_args, directory=str(root), **h_kwargs
    )

    with socketserver.TCPServer((args.bind, args.port), handler) as httpd:
        print(f"Serving SPA from {root} on http://{args.bind}:{args.port}/")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
