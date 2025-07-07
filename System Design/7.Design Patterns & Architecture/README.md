# Design Patterns & Architecture

## Table of Contents
1. [Monolith vs Microservices](#monolith-vs-microservices)
2. [Service-Oriented Architecture (SOA)](#service-oriented-architecture-soa)
3. [API Gateway](#api-gateway)
4. [Circuit Breaker, Bulkhead, Retry Patterns](#circuit-breaker-bulkhead-retry-patterns)
5. [Rate Limiting and Backpressure](#rate-limiting-and-backpressure)

---

## Monolith vs Microservices

### Monolithic Architecture
A monolithic architecture is a single, unified deployment unit where all components of an application are packaged together and deployed as one cohesive unit.

#### Characteristics:
- **Single Codebase**: All functionality exists in one repository
- **Shared Database**: Components share the same database
- **Single Deployment**: Entire application deployed as one unit
- **Centralized Business Logic**: All business rules in one place
- **Shared Runtime**: All components run in the same process

#### Advantages:
- **Simplicity**: Easy to develop, test, and deploy initially
- **Performance**: No network latency between components
- **Consistency**: Easy to maintain data consistency
- **Debugging**: Easier to debug with single call stack
- **Development Speed**: Fast initial development
- **Cost Effective**: Lower infrastructure costs initially

#### Disadvantages:
- **Scalability**: Difficult to scale individual components
- **Technology Lock-in**: Entire application uses same technology stack
- **Deployment Risk**: Changes to one component affect entire system
- **Team Coordination**: Multiple teams working on same codebase
- **Code Complexity**: Codebase becomes complex over time
- **Fault Isolation**: Failure in one component can bring down entire system

#### When to Choose Monolith:
- Small teams (< 10 developers)
- Simple applications with limited complexity
- Rapid prototyping and MVP development
- Well-defined and stable requirements
- Limited scalability requirements
- Cost-sensitive projects

### Microservices Architecture
Microservices architecture breaks down applications into small, independent services that communicate over well-defined APIs.

#### Characteristics:
- **Service Independence**: Each service can be developed, deployed, and scaled independently
- **Decentralized**: Services manage their own data and business logic
- **API Communication**: Services communicate via APIs (REST, gRPC, messaging)
- **Technology Diversity**: Different services can use different technologies
- **Fault Isolation**: Failure in one service doesn't affect others

#### Advantages:
- **Scalability**: Scale individual services based on demand
- **Technology Flexibility**: Use different technologies for different services
- **Independent Deployment**: Deploy services independently
- **Team Autonomy**: Teams can work independently on different services
- **Fault Isolation**: Better fault tolerance and resilience
- **Innovation**: Easier to experiment with new technologies

#### Disadvantages:
- **Complexity**: Increased operational complexity
- **Network Latency**: Communication overhead between services
- **Data Consistency**: Challenging to maintain consistency across services
- **Testing**: More complex integration testing
- **Monitoring**: Need sophisticated monitoring and logging
- **Infrastructure Overhead**: Higher infrastructure and operational costs

#### When to Choose Microservices:
- Large, complex applications
- Multiple teams working on different features
- High scalability requirements
- Need for technology diversity
- Mature DevOps practices
- Tolerance for operational complexity

### Migration Strategies

#### Strangler Fig Pattern
```
Legacy Monolith → Gradual Service Extraction → Full Microservices
```
- Gradually extract functionality from monolith
- Route traffic to new services incrementally
- Decommission monolith components over time

#### Database-per-Service Pattern
```
Shared Database → Service-specific Databases → Data Synchronization
```
- Each service owns its data
- Eliminate shared database dependencies
- Implement eventual consistency patterns

#### API Gateway Pattern
```
Client → API Gateway → Multiple Microservices
```
- Single entry point for all client requests
- Handle cross-cutting concerns (authentication, logging, rate limiting)
- Route requests to appropriate services

### Comparison Table

| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| **Deployment** | Single unit | Independent services |
| **Scalability** | Scale entire application | Scale individual services |
| **Technology** | Single stack | Multiple technologies |
| **Data Management** | Shared database | Service-specific databases |
| **Team Structure** | Single team | Multiple autonomous teams |
| **Complexity** | Simple initially | Complex from start |
| **Performance** | No network overhead | Network latency |
| **Fault Tolerance** | Single point of failure | Isolated failures |
| **Testing** | Easier integration testing | Complex distributed testing |
| **Monitoring** | Centralized | Distributed tracing needed |

---

## Service-Oriented Architecture (SOA)

### What is SOA?
Service-Oriented Architecture (SOA) is an architectural pattern where functionality is organized as a collection of services that communicate through well-defined interfaces and protocols.

#### Core Principles:
1. **Service Contracts**: Services expose formal contracts defining their capabilities
2. **Service Loose Coupling**: Services maintain minimal dependencies
3. **Service Abstraction**: Services hide internal implementation details
4. **Service Reusability**: Services are designed for reuse across applications
5. **Service Autonomy**: Services control their own environment and resources
6. **Service Statelessness**: Services minimize resource consumption
7. **Service Discoverability**: Services are discoverable and have metadata
8. **Service Composability**: Services can be composed to form larger solutions

### SOA Components

#### Service Provider
- Implements and hosts the service
- Publishes service contract to registry
- Responds to service requests

#### Service Consumer
- Discovers and invokes services
- Binds to service contract
- Handles service responses

#### Service Registry
- Central repository of service contracts
- Enables service discovery
- Maintains service metadata

#### Enterprise Service Bus (ESB)
- Middleware infrastructure for service communication
- Handles message routing, transformation, and protocol mediation
- Provides quality of service features

### SOA vs Microservices

| Aspect | SOA | Microservices |
|--------|-----|---------------|
| **Scope** | Enterprise-wide | Application-specific |
| **Communication** | ESB, SOAP | REST, gRPC, messaging |
| **Governance** | Centralized | Decentralized |
| **Data Sharing** | Shared databases common | Database per service |
| **Service Size** | Larger services | Smaller, focused services |
| **Technology** | Standards-based (XML, WSDL) | Technology agnostic |
| **Deployment** | Shared infrastructure | Independent deployment |

### SOA Implementation Patterns

#### Service Facade Pattern
```
Client → Service Facade → Multiple Backend Services
```
- Provides unified interface to multiple services
- Simplifies client interactions
- Aggregates data from multiple sources

#### Service Adapter Pattern
```
Service A → Adapter → Service B (Different Protocol)
```
- Enables communication between incompatible services
- Handles protocol and data format translation
- Maintains service independence

#### Service Orchestration vs Choreography

**Orchestration (Centralized)**
```
Process Controller → Service A → Service B → Service C
```
- Central coordinator manages service interactions
- Easier to monitor and control
- Single point of failure

**Choreography (Decentralized)**
```
Service A → Service B → Service C (Event-driven)
```
- Services coordinate through events
- More resilient and flexible
- Harder to monitor overall process

---

## API Gateway

### What is an API Gateway?
An API Gateway is a server that acts as a single entry point for all client requests to a backend system, providing a unified interface while handling cross-cutting concerns.

#### Core Functions:
- **Request Routing**: Route requests to appropriate backend services
- **Load Balancing**: Distribute requests across service instances
- **Authentication & Authorization**: Verify client identity and permissions
- **Rate Limiting**: Control request frequency and prevent abuse
- **Request/Response Transformation**: Modify requests and responses
- **Caching**: Cache responses to improve performance
- **Monitoring & Analytics**: Track API usage and performance

### API Gateway Architecture

```
Client Applications → API Gateway → Microservices
                                 → Legacy Systems
                                 → External APIs
```

#### Components:

**Gateway Core**
- Request processing engine
- Routing logic
- Plugin architecture for extensions

**Policy Engine**
- Security policies
- Rate limiting policies
- Transformation rules

**Service Discovery**
- Dynamic service registration
- Health checking
- Load balancing

**Management Interface**
- API configuration
- Policy management
- Analytics dashboard

### API Gateway Patterns

#### Backend for Frontend (BFF)
```
Mobile App → Mobile BFF → Services
Web App → Web BFF → Services
```
- Separate API Gateway for each client type
- Optimized for specific client needs
- Reduces over-fetching and under-fetching

#### Micro Gateway Pattern
```
Service A → Micro Gateway → Service B
```
- Lightweight gateway per service
- Handles service-specific concerns
- Reduces centralization bottlenecks

#### API Composition Pattern
```
Client → API Gateway → [Service A + Service B + Service C] → Aggregated Response
```
- Combines multiple service calls
- Reduces client complexity
- Handles partial failures

### API Gateway Benefits

#### For Clients:
- **Simplified Integration**: Single endpoint for all services
- **Consistent Interface**: Uniform API experience
- **Reduced Complexity**: No need to manage multiple endpoints
- **Improved Performance**: Caching and request optimization

#### For Services:
- **Cross-cutting Concerns**: Centralized handling of common features
- **Service Evolution**: Independent service changes without client impact
- **Security**: Centralized security policies
- **Monitoring**: Comprehensive API usage tracking

### API Gateway Challenges

#### Performance Bottleneck
- Single point of failure
- Latency introduction
- Scalability limitations

#### Complexity
- Configuration complexity
- Debugging difficulties
- Operational overhead

#### Vendor Lock-in
- Proprietary features
- Migration challenges
- Technology dependencies

### Popular API Gateway Solutions

#### Open Source:
- **Kong**: Scalable, plugin-based gateway
- **Zuul**: Netflix's gateway solution
- **Traefik**: Modern reverse proxy and load balancer
- **Envoy**: High-performance proxy

#### Cloud-based:
- **AWS API Gateway**: Fully managed service
- **Azure API Management**: Enterprise API platform
- **Google Cloud Endpoints**: API management platform
- **Kong Enterprise**: Commercial Kong offering

---

## Circuit Breaker, Bulkhead, Retry Patterns

### Circuit Breaker Pattern
The Circuit Breaker pattern prevents cascading failures by monitoring service calls and stopping requests to failing services.

#### States:
1. **Closed**: Normal operation, requests pass through
2. **Open**: Service is failing, requests are blocked
3. **Half-Open**: Limited requests allowed to test service recovery

#### Implementation:
```
Circuit Breaker States:
Closed → (Failure threshold reached) → Open
Open → (Timeout reached) → Half-Open
Half-Open → (Success) → Closed
Half-Open → (Failure) → Open
```

#### Configuration Parameters:
- **Failure Threshold**: Number of failures before opening circuit
- **Timeout**: How long to wait before testing service recovery
- **Success Threshold**: Number of successes needed to close circuit
- **Reset Timeout**: Time to wait before resetting failure count

#### Benefits:
- **Prevents Cascading Failures**: Stops failure propagation
- **Improves System Resilience**: Faster failure detection
- **Resource Protection**: Prevents resource exhaustion
- **Graceful Degradation**: Allows fallback mechanisms

#### Example Implementation:
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'
    
    def call(self, func, *args, **kwargs):
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.timeout:
                self.state = 'HALF_OPEN'
            else:
                raise CircuitBreakerOpenException()
        
        try:
            result = func(*args, **kwargs)
            self.reset()
            return result
        except Exception as e:
            self.record_failure()
            raise e
    
    def record_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = 'OPEN'
    
    def reset(self):
        self.failure_count = 0
        self.state = 'CLOSED'
```

### Bulkhead Pattern
The Bulkhead pattern isolates resources to prevent total system failure when one component fails.

#### Types:

**Thread Pool Bulkhead**
```
Service A → Thread Pool 1 (10 threads)
Service B → Thread Pool 2 (10 threads)
Service C → Thread Pool 3 (10 threads)
```
- Separate thread pools for different services
- Prevents thread pool exhaustion
- Isolates service failures

**Connection Pool Bulkhead**
```
Database Service → Connection Pool 1 (50 connections)
Cache Service → Connection Pool 2 (20 connections)
External API → Connection Pool 3 (10 connections)
```
- Separate connection pools for different resources
- Prevents connection starvation
- Improves resource utilization

**Service Instance Bulkhead**
```
Critical Operations → Service Instance Group 1
Non-Critical Operations → Service Instance Group 2
```
- Separate service instances for different operations
- Ensures critical operations aren't affected
- Provides resource isolation

#### Implementation Strategies:

**Resource Partitioning**
- CPU cores allocation
- Memory allocation
- Network bandwidth allocation
- Storage I/O allocation

**Process Isolation**
- Separate processes for different services
- Container-based isolation
- Virtual machine isolation

### Retry Pattern
The Retry pattern handles transient failures by automatically retrying failed operations.

#### Retry Strategies:

**Immediate Retry**
```
Request → Failure → Immediate Retry → Success/Failure
```
- Suitable for very transient failures
- Risk of overwhelming failing service
- Simple to implement

**Fixed Interval Retry**
```
Request → Failure → Wait(fixed) → Retry → Wait(fixed) → Retry
```
- Consistent retry intervals
- Predictable behavior
- May not be optimal for all scenarios

**Exponential Backoff**
```
Request → Failure → Wait(1s) → Retry → Wait(2s) → Retry → Wait(4s) → Retry
```
- Increasing wait times between retries
- Reduces load on failing service
- Good for temporary overload situations

**Exponential Backoff with Jitter**
```
Wait Time = Base_Delay × (2^attempt) + Random_Jitter
```
- Adds randomness to prevent thundering herd
- Distributes retry attempts
- Reduces service load spikes

#### Retry Configuration:
- **Max Retry Attempts**: Maximum number of retry attempts
- **Retry Delay**: Base delay between retries
- **Backoff Multiplier**: Exponential backoff factor
- **Jitter**: Random variation in retry timing
- **Timeout**: Maximum time for retry attempts

#### Implementation Considerations:
- **Idempotency**: Ensure operations are safe to retry
- **Transient vs Permanent Failures**: Don't retry permanent failures
- **Circuit Breaker Integration**: Combine with circuit breaker pattern
- **Monitoring**: Track retry metrics and patterns

### Combining Patterns

#### Circuit Breaker + Retry
```
Request → Retry Logic → Circuit Breaker → Service
```
- Retry for transient failures
- Circuit breaker for persistent failures
- Prevents unnecessary retry attempts

#### Bulkhead + Circuit Breaker
```
Request → Bulkhead (Resource Isolation) → Circuit Breaker → Service
```
- Resource isolation prevents cascading failures
- Circuit breaker prevents failure propagation
- Comprehensive resilience strategy

#### Timeout + Retry + Circuit Breaker
```
Request → Timeout → Retry → Circuit Breaker → Service
```
- Timeout prevents hanging requests
- Retry handles transient failures
- Circuit breaker handles persistent failures

---

## Rate Limiting and Backpressure

### Rate Limiting
Rate limiting controls the frequency of requests to prevent system overload and ensure fair resource usage.

#### Types of Rate Limiting:

**Request Rate Limiting**
- Limits number of requests per time period
- Example: 100 requests per minute per user
- Prevents API abuse and ensures fair usage

**Bandwidth Rate Limiting**
- Limits data transfer rate
- Example: 1 MB/s per connection
- Prevents network congestion

**Connection Rate Limiting**
- Limits number of concurrent connections
- Example: 10 connections per IP address
- Prevents resource exhaustion

**Resource Rate Limiting**
- Limits specific resource usage
- Example: CPU time, memory usage
- Prevents resource starvation

#### Rate Limiting Algorithms:

**Token Bucket Algorithm**
```
Bucket (Fixed Capacity) → Tokens added at fixed rate
Request → Consume token → Process request
No tokens → Reject request
```
- Allows burst traffic up to bucket capacity
- Smooth rate limiting over time
- Configurable burst size

**Leaky Bucket Algorithm**
```
Requests → Bucket (FIFO Queue) → Process at fixed rate
Bucket full → Drop requests
```
- Smooths out traffic spikes
- Consistent processing rate
- Simple to implement

**Fixed Window Algorithm**
```
Window: [00:00-00:59] → Count requests in window
Reset counter at window boundary
```
- Simple to implement
- Memory efficient
- Potential for traffic spikes at window boundaries

**Sliding Window Algorithm**
```
Window slides continuously
Count requests in current window
More accurate than fixed window
```
- Smoother rate limiting
- No boundary effects
- More complex to implement

**Sliding Window Counter Algorithm**
```
Combines fixed window efficiency with sliding window accuracy
Uses multiple fixed windows
Approximates sliding window behavior
```
- Good balance of accuracy and efficiency
- Reduced memory usage
- Suitable for high-traffic scenarios

#### Rate Limiting Implementation:

**Client-Side Rate Limiting**
```python
class RateLimiter:
    def __init__(self, max_requests, time_window):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
    
    def allow_request(self):
        now = time.time()
        # Remove old requests outside time window
        self.requests = [req_time for req_time in self.requests 
                        if now - req_time < self.time_window]
        
        if len(self.requests) < self.max_requests:
            self.requests.append(now)
            return True
        return False
```

**Server-Side Rate Limiting**
```python
# Redis-based rate limiting
def rate_limit_user(user_id, max_requests, time_window):
    key = f"rate_limit:{user_id}"
    current_requests = redis.get(key) or 0
    
    if int(current_requests) >= max_requests:
        return False
    
    pipe = redis.pipeline()
    pipe.incr(key)
    pipe.expire(key, time_window)
    pipe.execute()
    
    return True
```

#### Rate Limiting Strategies:

**Per-User Rate Limiting**
- Individual limits for each user
- Prevents single user from monopolizing resources
- Requires user identification

**Per-IP Rate Limiting**
- Limits based on IP address
- Prevents abuse from specific sources
- May affect legitimate users behind NAT

**API Key Based Rate Limiting**
- Different limits for different API keys
- Enables tiered service levels
- Requires API key management

**Distributed Rate Limiting**
- Coordinated rate limiting across multiple servers
- Consistent limits in distributed systems
- Requires shared state management

### Backpressure
Backpressure is a mechanism to handle situations where data is produced faster than it can be consumed.

#### Types of Backpressure:

**Blocking Backpressure**
```
Producer → Buffer (Full) → Producer Blocks
```
- Producer waits when buffer is full
- Simple to implement
- Risk of deadlocks

**Dropping Backpressure**
```
Producer → Buffer (Full) → Drop new data
```
- Drop newest or oldest data when buffer is full
- Prevents system overload
- Data loss occurs

**Buffering Backpressure**
```
Producer → Expanding Buffer → Consumer
```
- Increase buffer size dynamically
- Handles temporary load spikes
- Memory usage can grow unbounded

**Throttling Backpressure**
```
Producer → Rate Limiter → Buffer → Consumer
```
- Reduce producer rate when buffer fills
- Maintains system stability
- May slow down overall throughput

#### Backpressure Implementation Patterns:

**Reactive Streams**
```java
// RxJava backpressure handling
Observable.range(1, 1000000)
    .onBackpressureBuffer(1000)  // Buffer up to 1000 items
    .observeOn(Schedulers.computation())
    .subscribe(this::processItem);
```

**Flow Control**
```python
class FlowController:
    def __init__(self, max_queue_size=1000):
        self.queue = asyncio.Queue(maxsize=max_queue_size)
        self.processing = False
    
    async def send(self, item):
        try:
            await self.queue.put(item, timeout=1.0)
        except asyncio.TimeoutError:
            # Apply backpressure
            raise BackpressureException("Queue full")
    
    async def process(self):
        while True:
            item = await self.queue.get()
            await self.handle_item(item)
            self.queue.task_done()
```

**Circuit Breaker Integration**
```python
class BackpressureCircuitBreaker:
    def __init__(self, max_queue_size, failure_threshold):
        self.max_queue_size = max_queue_size
        self.current_queue_size = 0
        self.circuit_breaker = CircuitBreaker(failure_threshold)
    
    def handle_request(self, request):
        if self.current_queue_size >= self.max_queue_size:
            self.circuit_breaker.record_failure()
            raise BackpressureException("System overloaded")
        
        try:
            result = self.process_request(request)
            self.circuit_breaker.reset()
            return result
        except Exception as e:
            self.circuit_breaker.record_failure()
            raise e
```

### Monitoring and Metrics

#### Rate Limiting Metrics:
- **Request Rate**: Current requests per second
- **Throttle Rate**: Percentage of requests throttled
- **User Distribution**: Rate limiting per user/IP
- **Error Rate**: Rate of rate-limited requests

#### Backpressure Metrics:
- **Queue Size**: Current buffer/queue size
- **Queue Growth Rate**: Rate of queue size increase
- **Processing Latency**: Time to process items
- **Drop Rate**: Rate of dropped items

#### Alerting Thresholds:
- High throttle rates (> 10%)
- Growing queue sizes
- Increasing processing latency
- High error rates

### Best Practices

#### Rate Limiting Best Practices:
1. **Graceful Degradation**: Provide meaningful error messages
2. **Header Information**: Include rate limit headers in responses
3. **Whitelist Critical Services**: Exempt critical operations from rate limiting
4. **Adaptive Limits**: Adjust limits based on system load
5. **Monitoring**: Track rate limiting effectiveness

#### Backpressure Best Practices:
1. **Early Detection**: Monitor queue sizes and processing rates
2. **Graceful Degradation**: Implement fallback mechanisms
3. **Load Shedding**: Drop less critical requests first
4. **Capacity Planning**: Plan for peak loads
5. **Circuit Breaker Integration**: Combine with circuit breaker pattern

---

## Best Practices Summary

### Architecture Decision Framework
1. **Start Simple**: Begin with monolith, evolve to microservices
2. **Business Alignment**: Align services with business capabilities
3. **Team Structure**: Organize teams around services (Conway's Law)
4. **Data Ownership**: Each service owns its data
5. **Automation**: Invest in CI/CD and monitoring

### Resilience Patterns
1. **Defense in Depth**: Layer multiple resilience patterns
2. **Fail Fast**: Detect failures quickly and fail gracefully
3. **Graceful Degradation**: Provide reduced functionality during failures
4. **Monitoring**: Implement comprehensive monitoring and alerting
5. **Testing**: Test failure scenarios regularly

### API Design
1. **Consistent Interface**: Maintain consistent API design
2. **Versioning Strategy**: Plan for API evolution
3. **Documentation**: Maintain up-to-date API documentation
4. **Security**: Implement proper authentication and authorization
5. **Rate Limiting**: Protect APIs from abuse

### Operational Excellence
1. **Observability**: Implement logging, metrics, and tracing
2. **Automation**: Automate deployment and operations
3. **Security**: Implement security best practices
4. **Disaster Recovery**: Plan for disaster recovery scenarios
5. **Continuous Improvement**: Regularly review and improve architecture

---

*This documentation provides a comprehensive overview of design patterns and architecture in system design. For specific implementation details, consult the relevant technology documentation and best practices guides.*