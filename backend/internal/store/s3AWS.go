package store

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"mime/multipart"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go/aws"
	gay "github.com/barcek2281/AKT/backend/internal/config"
)

type S3AWS struct {
	config     *gay.Config
	Client     *s3.Client
	BucketName string
}

func NewS3AWS(c *gay.Config) (*S3AWS, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(c.AWS_REGION))
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.UsePathStyle = true // Ensure path-style addressing
		o.BaseEndpoint = aws.String(fmt.Sprintf("https://s3.%s.amazonaws.com", c.AWS_REGION))
	})

	return &S3AWS{
		config:     c,
		Client:     client,
		BucketName: c.S3_BUCKET_NAME,
	}, nil
}

func (s *S3AWS) UploadImage(file multipart.File, fileName string) (string, error) {
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	_, err = s.Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(s.BucketName),
		Key:    aws.String(fileName),
		Body:   bytes.NewReader(fileBytes),
		ACL:    "public-read", // Makes the object public
	})
	if err != nil {
		return "", err
	}

	fileURL := fmt.Sprintf("https://%s.s3.amazonaws.com/%s", s.BucketName, fileName)
	return fileURL, nil
}

func (s *S3AWS) DownloadImage(fileName string) (string, error) {
	presignClient := s3.NewPresignClient(s.Client)
	presignedURL, err := presignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(s.BucketName),
		Key:    aws.String(fileName),
	})
	if err != nil {
		return "", err
	}
	
	return presignedURL.URL, nil
}
