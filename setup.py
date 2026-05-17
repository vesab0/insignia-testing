"""
Setup configuration for the restaurant management system
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [
        line.strip() for line in fh if line.strip() and not line.startswith("#")
    ]

setup(
    name="restaurant-management-system",
    version="1.0.0",
    author="Insignia Team",
    author_email="team@example.com",
    description="A professional restaurant management system with Flask backend",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/restaurant-management",
    packages=find_packages(exclude=["tests", "tests.*"]),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Application Frameworks",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Framework :: Flask",
    ],
    python_requires=">=3.9",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=7.4.3",
            "pytest-cov>=4.1.0",
            "pytest-flask>=1.3.0",
            "black>=23.12.1",
            "flake8>=7.0.0",
            "pylint>=3.0.3",
            "mypy>=1.8.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "restaurant-server=run:main",
        ],
    },
)
