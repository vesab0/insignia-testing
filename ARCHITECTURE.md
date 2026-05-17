# Architecture Documentation

## Overview

This document describes the architecture of the Restaurant Management System, explaining design decisions, patterns used, and how components interact.

## Architecture Pattern

The application follows a **Layered Architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (HTML Templates, CSS, JS)        │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Application Layer           │
│      (Flask Routes, Controllers)    │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│          Business Layer             │
│    (Services, Business Logic)       │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│           Data Layer                │
│    (Models, Data Access)            │
└─────────────────────────────────────┘
```

## Component Breakdown

### 1. Presentation Layer

**Location**: `frontend/`

**Responsibilities**:
- User interface rendering
- Client-side interactions
- Form handling
- Visual effects and animations

**Technologies**:
- HTML5 (Jinja2 templates)
- CSS3 (custom properties, animations)
- Vanilla JavaScript (ES6+)

**Key Files**:
- `templates/index.html`: Main template
- `static/css/styles.css`: Styling
- `static/js/app.js`: Client-side logic

### 2. Application Layer

**Location**: `backend/app.py`

**Responsibilities**:
- HTTP request/response handling
- Route definitions
- Request validation
- Error handling
- Response formatting

**Key Components**:
```python
create_app()              # Application factory
@app.route('/')          # Route handlers
@app.errorhandler()      # Error handlers
```

**Design Patterns**:
- **Application Factory**: Allows multiple app instances with different configs
- **Dependency Injection**: Services injected into routes
- **Error Handler Pattern**: Centralized error handling

### 3. Business Layer

**Location**: `backend/services.py`

**Responsibilities**:
- Business logic implementation
- Data processing
- External service integration
- Transaction management

**Key Services**:

#### ReservationService
```python
class ReservationService:
    def create_reservation(reservation: Reservation) -> Dict
    def get_reservation(reservation_id: str) -> Optional[Reservation]
    def cancel_reservation(reservation_id: str) -> bool
    def _has_conflict(reservation: Reservation) -> bool
```

#### EmailService
```python
class EmailService:
    def send_reservation_confirmation(reservation: Reservation) -> bool
    def subscribe_newsletter(newsletter: Newsletter) -> Dict
    def unsubscribe_newsletter(email: str) -> bool
```

**Design Patterns**:
- **Service Layer Pattern**: Encapsulates business logic
- **Single Responsibility**: Each service has one purpose
- **Dependency Injection**: Services receive dependencies via constructor

### 4. Data Layer

**Location**: `backend/models.py`

**Responsibilities**:
- Data structure definitions
- Data validation
- Serialization/deserialization
- Database interactions (future)

**Key Models**:

```python
@dataclass
class Reservation:
    name: str
    email: str
    phone: str
    guests: int
    date: str
    time: str
    message: str = ""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    status: str = "pending"
```

**Design Patterns**:
- **Data Transfer Object (DTO)**: Models transfer data between layers
- **Factory Pattern**: UUID generation for IDs
- **Immutability**: Dataclasses with frozen option (optional)

## Cross-Cutting Concerns

### 1. Validation Layer

**Location**: `backend/validators.py`

**Purpose**: Input validation separated from business logic

**Hierarchy**:
```
BaseValidator
├── EmailValidator
├── PhoneValidator
├── DateValidator
├── TimeValidator
├── GuestsValidator
└── ReservationValidator (composite)
```

**Pattern**: **Strategy Pattern** - Different validation strategies

### 2. Exception Handling

**Location**: `backend/exceptions.py`

**Hierarchy**:
```
RestaurantException (base)
├── ValidationError
├── ServiceError
├── DatabaseError
├── EmailError
├── ReservationError
├── NotFoundError
└── ConflictError
```

**Pattern**: **Exception Hierarchy** - Specific exceptions for different scenarios

### 3. Configuration Management

**Location**: `backend/config.py`

**Structure**:
```
Config (base)
├── DevelopmentConfig
├── TestingConfig
└── ProductionConfig
```

**Pattern**: **Strategy Pattern** - Different configs for different environments

## Data Flow

### Reservation Creation Flow

```
1. User submits form (Presentation)
   ↓
2. POST /api/reservations (Application)
   ↓
3. ReservationValidator.is_valid() (Validation)
   ↓
4. Reservation model created (Data)
   ↓
5. ReservationService.create_reservation() (Business)
   ↓
6. EmailService.send_confirmation() (Business)
   ↓
7. JSON response returned (Application)
   ↓
8. Toast notification shown (Presentation)
```

### Error Handling Flow

```
1. Error occurs in any layer
   ↓
2. Custom exception raised
   ↓
3. Error handler catches exception
   ↓
4. Error logged
   ↓
5. User-friendly error response
   ↓
6. Client displays error message
```

## Design Principles Applied

### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Each class has one reason to change
   - Validators only validate
   - Services only contain business logic
   - Models only represent data

2. **Open/Closed Principle (OCP)**
   - Open for extension (new validators, services)
   - Closed for modification (base classes stable)

3. **Liskov Substitution Principle (LSP)**
   - All validators can be used interchangeably
   - All configs can substitute base Config

4. **Interface Segregation Principle (ISP)**
   - Small, focused interfaces
   - Validators have minimal methods

5. **Dependency Inversion Principle (DIP)**
   - Depend on abstractions (base classes)
   - Services injected, not created

### Other Principles

- **DRY (Don't Repeat Yourself)**: Reusable components
- **KISS (Keep It Simple, Stupid)**: Simple, clear code
- **YAGNI (You Aren't Gonna Need It)**: Only implement what's needed
- **Separation of Concerns**: Each layer has distinct responsibility

## Security Architecture

### Input Validation
- All inputs validated before processing
- Type checking with type hints
- Format validation (email, phone, date)
- Business rule validation (date ranges, guest limits)

### Error Handling
- Generic error messages to users
- Detailed logging for developers
- No sensitive data in error responses

### Configuration
- Secrets in environment variables
- Different configs for different environments
- Production config enforces security settings

### Future Enhancements
- CSRF protection
- Rate limiting
- SQL injection prevention (with ORM)
- XSS protection (template escaping)
- Authentication/Authorization

## Testing Architecture

### Test Pyramid

```
        ┌─────────┐
        │   E2E   │  (Few)
        └─────────┘
      ┌─────────────┐
      │ Integration │  (Some)
      └─────────────┘
    ┌─────────────────┐
    │   Unit Tests    │  (Many)
    └─────────────────┘
```

### Test Organization

```
tests/
├── test_validators.py    # Unit tests for validators
├── test_services.py      # Unit tests for services
├── test_models.py        # Unit tests for models
├── test_api.py          # Integration tests for API
└── conftest.py          # Test fixtures
```

### Test Patterns
- **AAA Pattern**: Arrange, Act, Assert
- **Test Fixtures**: Reusable test data
- **Mocking**: Isolate units under test
- **Parametrized Tests**: Test multiple scenarios

## Performance Considerations

### Current Optimizations
- In-memory storage (fast but not persistent)
- Throttled event handlers (scroll, resize)
- Lazy loading for animations
- GPU-accelerated CSS animations

### Future Optimizations
- Database connection pooling
- Redis caching
- CDN for static assets
- Gzip compression
- Database indexing
- Query optimization

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Session storage in Redis (future)
- Load balancer ready

### Vertical Scaling
- Efficient algorithms
- Minimal memory footprint
- Async operations (future)

### Database Scaling
- Read replicas (future)
- Sharding strategy (future)
- Connection pooling

## Deployment Architecture

### Development
```
Developer Machine
├── Python 3.9+
├── Flask dev server
└── SQLite (future)
```

### Production
```
Load Balancer
├── App Server 1 (Gunicorn)
├── App Server 2 (Gunicorn)
└── App Server N (Gunicorn)
     ↓
Database Server (PostgreSQL)
     ↓
Redis Cache
```

## Future Architecture Enhancements

### Microservices (Long-term)
```
API Gateway
├── Reservation Service
├── Menu Service
├── User Service
├── Payment Service
└── Notification Service
```

### Event-Driven Architecture
```
Event Bus (RabbitMQ/Kafka)
├── Reservation Created Event
├── Payment Processed Event
└── Email Sent Event
```

### CQRS Pattern
- Separate read and write models
- Optimized queries
- Event sourcing

## Monitoring & Observability

### Logging
- Structured logging (JSON)
- Log levels (DEBUG, INFO, WARNING, ERROR)
- Centralized log aggregation (future)

### Metrics
- Request count
- Response time
- Error rate
- Business metrics (reservations/day)

### Tracing
- Request tracing (future)
- Performance profiling
- Bottleneck identification

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Maintainable codebase
- ✅ Testable components
- ✅ Scalable design
- ✅ Security-first approach
- ✅ Performance optimization
- ✅ Future-proof structure

The architecture follows industry best practices and can evolve as requirements grow.