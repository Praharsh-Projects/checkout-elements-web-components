# 0001: Separate Host State, Instance State, and Monitoring Events

Status: accepted

## Context

The workbench renders one checkout summary as a React component and another as a
custom element. Locale and failure controls must update both previews, while
each checkout instance owns its own request lifecycle and quote. An integrating
host may also need timing and outcome signals without receiving checkout data.

## Decision

- Keep preview preferences in a Redux Toolkit slice because they are shared by
  both integration surfaces.
- Keep quote loading, ready, and error transitions in a local reducer inside
  each checkout component.
- Validate custom-element JSON before rendering it.
- Emit a `checkout:metric` event containing only metric name, outcome, and
  duration.
- Emit confirmation data only after the validated quote resolves.

## Alternatives considered

### Put every checkout state in Redux

Rejected because independent custom-element instances would become coupled to a
host-specific store. Store keys and cleanup would also become part of the public
integration contract.

### Keep all state local

Rejected for the workbench because the locale and failure controls intentionally
coordinate two separate preview surfaces.

### Emit the full session with monitoring events

Rejected because item names, monetary values, and session identifiers are not
needed to observe request outcome and latency.

## Consequences

- Shared host preferences and isolated request state have different, explicit
  owners.
- The custom element remains usable without React Redux in the host application.
- Monitoring adapters can subscribe without receiving checkout-session data.
- A production payment integration would still require authentication,
  authorization, privacy review, durable observability, and provider-specific
  failure handling outside this repository.
