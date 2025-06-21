---
id: troubleshooting
title: Troubleshooting Guide
sidebar_label: Troubleshooting
---

# Troubleshooting Guide

This guide helps you resolve common issues when using the Hokusai data pipeline and SDK.

## Common Issues

### Installation Issues

**Problem: Permission denied during setup**
```bash
./setup.sh: Permission denied
```
**Solution:**
```bash
chmod +x setup.sh
./setup.sh
```

**Problem: Python version mismatch**
```
Error: Python 3.8+ required, found 3.7
```
**Solution:**
- Install Python 3.8 or higher
- Use pyenv to manage Python versions:
```bash
pyenv install 3.11.8
pyenv local 3.11.8
```

### Data Validation Issues

**Problem: Schema validation fails**
```
Error: Column 'query_id' not found in data
```
**Solution:**
- Check that your data has all required columns
- Verify column names match exactly (case-sensitive)
- Review model-specific requirements

**Problem: Data quality score too low**
```
Warning: Data quality score 0.65 below threshold 0.80
```
**Solution:**
- Remove duplicate entries
- Fill in missing values
- Ensure consistent formatting
- Check for data anomalies

### Privacy Compliance Issues

**Problem: PII detected in data**
```
Error: PII detected in fields: email, phone
```
**Solution:**
- Enable automatic PII handling:
```bash
export ENABLE_PII_DETECTION=true
export PII_HASH_ALGORITHM=sha256
```
- Or manually anonymize data before submission

### Pipeline Execution Issues

**Problem: Out of memory error**
```
Error: MemoryError during model training
```
**Solution:**
- Reduce batch size:
```bash
export BATCH_SIZE=1000
```
- Increase memory limit:
```bash
export MEMORY_LIMIT_GB=16
```
- Use data sampling for large datasets

**Problem: Pipeline timeout**
```
Error: Pipeline step timed out after 300 seconds
```
**Solution:**
- Increase timeout:
```bash
export PIPELINE_TIMEOUT=600
```
- Optimize data processing
- Check for infinite loops

### MLFlow Issues

**Problem: MLFlow UI not accessible**
```
Error: Cannot connect to MLFlow server
```
**Solution:**
- Check if MLFlow is running:
```bash
ps aux | grep mlflow
```
- Start MLFlow UI:
```bash
mlflow ui --port 5000
```
- Check firewall settings

### API/SDK Issues

**Problem: Authentication failed**
```
Error: Invalid API key
```
**Solution:**
- Verify API key is correct
- Check key hasn't expired
- Ensure proper environment variable:
```bash
export HOKUSAI_API_KEY=your_key_here
```

**Problem: Connection timeout**
```
Error: Request timeout after 30 seconds
```
**Solution:**
- Check internet connection
- Verify API endpoint URL
- Increase timeout setting
- Check proxy settings if behind firewall

## Debug Mode

Enable debug logging for more detailed error information:

```bash
# For pipeline
export PIPELINE_LOG_LEVEL=DEBUG

# For SDK
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Getting Help

If you can't resolve an issue:

1. Check the [FAQ](faqs.md)
2. Search [GitHub Issues](https://github.com/hokusai/hokusai-data-pipeline/issues)
3. Join our [Discord community](https://discord.gg/hokusai)
4. Contact [Support](https://hokus.ai/contact-us/)

When reporting issues, include:
- Error message
- Steps to reproduce
- Environment details (OS, Python version)
- Relevant configuration
- Debug logs if available