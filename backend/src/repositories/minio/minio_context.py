from minio import Minio

from src.config import s3_config


class MinioContext:

    client: Minio = Minio(endpoint=s3_config.uri,
                          access_key=s3_config.access_key,
                          secret_key=s3_config.secret_key)

    def __init__(self,
                 bucket_name: str,
                 *,
                 client: Minio | None = None,
                 create_buckets: bool = False):
        if client is not None:
            self.client = client

        self.create_buckets = create_buckets
        self.bucket_name = bucket_name



