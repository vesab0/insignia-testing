# Contributing to Restaurant Management System

Thank you for considering contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Python version, etc.)
   - Screenshots if applicable

### Suggesting Enhancements

1. Check if the enhancement has been suggested
2. Create a new issue with:
   - Clear description of the enhancement
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding standards (see below)
   - Write tests for new features
   - Update documentation

4. **Run tests**
   ```bash
   pytest
   ```

5. **Run linting**
   ```bash
   black backend/ tests/
   flake8 backend/ tests/
   ```

6. **Commit your changes**
   ```bash
   git commit -m "Add feature: description"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Provide clear description
   - Reference related issues
   - Include screenshots if UI changes

## Coding Standards

### Python Style Guide

- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use meaningful variable names
- Write docstrings for all functions/classes

### Example:

```python
def calculate_total(items: List[float], tax_rate: float = 0.1) -> float:
    """
    Calculate total price including tax.
    
    Args:
        items: List of item prices
        tax_rate: Tax rate as decimal (default 0.1 for 10%)
    
    Returns:
        Total price including tax
    
    Raises:
        ValueError: If tax_rate is negative
    """
    if tax_rate < 0:
        raise ValueError("Tax rate cannot be negative")
    
    subtotal = sum(items)
    return subtotal * (1 + tax_rate)
```

### Testing Standards

- Write tests for all new features
- Aim for 90%+ code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Example:

```python
def test_calculate_total_with_valid_inputs():
    # Arrange
    items = [10.0, 20.0, 30.0]
    tax_rate = 0.1
    
    # Act
    result = calculate_total(items, tax_rate)
    
    # Assert
    assert result == 66.0
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat: Add email validation to reservation form

- Implement EmailValidator class
- Add comprehensive email format checking
- Include tests for edge cases

Closes #123
```

## Project Structure

```
backend/          # Backend Python code
  ├── app.py      # Flask application
  ├── models.py   # Data models
  ├── services.py # Business logic
  └── validators.py # Input validation

frontend/         # Frontend assets
  ├── static/     # CSS, JS, images
  └── templates/  # HTML templates

tests/            # Test suite
  └── test_app.py # Tests
```

## Development Workflow

1. **Set up development environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Write tests first (TDD)**
   ```bash
   # Write failing test
   pytest tests/test_my_feature.py
   ```

4. **Implement feature**
   ```python
   # Write code to make test pass
   ```

5. **Run all tests**
   ```bash
   pytest
   ```

6. **Check code quality**
   ```bash
   black backend/ tests/
   flake8 backend/ tests/
   mypy backend/
   ```

7. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: Add my feature"
   git push origin feature/my-feature
   ```

8. **Create Pull Request**

## Review Process

1. Automated checks must pass (tests, linting)
2. At least one maintainer review required
3. Address review comments
4. Maintainer merges when approved

## Questions?

- Open an issue for questions
- Tag with `question` label
- Be specific about what you need help with

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing! 🎉