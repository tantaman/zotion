- update editor content from a transaction where we diff to find correct replacements.

How will the server maintain the doc and update clients?

It would suck to update the full doc on every keystroke.

We can do the doc out-of-band of Zero.

WS server on API server. Spun up for collab editing.

Zero can sync initial doc. We can tell WS server what version we have of it on connect.

WS server can occasionally persist to PG.
