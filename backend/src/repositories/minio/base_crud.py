class MinioCRUD:
    client

    _bucket_name: str | None = None

    create_buckets: bool = False



    @property
    def bucket_name(self) -> str:
        if self.client is None:
            raise ConnectionError("Client is not initialized")
        if self._bucket_name is None:
            raise ConnectionError("Bucket name is not set")

        if not self.client.bucket_exists(bucket_name=self._bucket_name):
            if self.create_buckets:
                self.client.make_bucket(bucket_name=self._bucket_name)
            else:
                raise ConnectionError("Bucket does not exist")
        return self._bucket_name

    @bucket_name.setter
    def bucket_name(self, bucket_name: str) -> None:
        if self.client is None:
            raise ConnectionError("Client is not initialized")
        if bucket_name is None:
            raise ConnectionError("Bucket name is not set")

        if not self.client.bucket_exists(bucket_name=bucket_name):
            if self.create_buckets:
                self.client.make_bucket(bucket_name=bucket_name)
            else:
                raise ConnectionError("Bucket does not exist")

        self._bucket_name = bucket_name
