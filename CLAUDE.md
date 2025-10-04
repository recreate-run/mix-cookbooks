## Tech Stack

- ALWAYS use uv for Python package management and virtual environments

## Code style

1. As this is an early-stage startup, YOU MUST prioritize simple, readable code with minimal abstraction—avoid premature optimization. Strive for elegant, minimal solutions that reduce complexity.Focus on clear implementation that’s easy to understand and iterate on as the product evolves.
2. NEVER mock LLM API calls
3. DO NOT preserve backward compatibility unless the user specifically requests it
4. Do not handle errors (eg. API failures) gracefully, raise exceptions immediately.
