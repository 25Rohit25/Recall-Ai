# API Documentation

All API endpoints follow RESTful principles and are prefixed with `/api/v1`.

## 1. Meetings API

### `GET /api/v1/meetings`
Retrieve a paginated list of all meetings.
- **Response**: `200 OK`
```json
{
  "items": [
    { "id": "uuid", "title": "Product Sync", "date": "2023-10-12T10:00:00Z", "duration": 3600 }
  ],
  "total": 1
}
```

### `POST /api/v1/meetings`
Create a new meeting (usually via file upload).
- **Body**: `multipart/form-data` (audio file + title)
- **Response**: `201 Created`

### `GET /api/v1/meetings/{id}`
Retrieve full meeting metadata, including the AI-generated executive summary.

---

## 2. Transcript API

### `GET /api/v1/transcripts/{meeting_id}`
Retrieve all transcript segments for a meeting, ordered by `start_time`.
- **Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "speaker": "Speaker 1",
    "text": "Hello everyone, let's start.",
    "start_time": 0.0,
    "end_time": 2.5
  }
]
```

---

## 3. Workspace Intelligence API

### `GET /api/v1/workspace/{meeting_id}/chapters`
Retrieve timestamped chapters.

### `GET /api/v1/workspace/{meeting_id}/action-items`
Retrieve extracted tasks.

### `POST /api/v1/workspace/{meeting_id}/generate`
Manually trigger the AI pipeline to regenerate summaries and action items.
- **Response**: `202 Accepted` (Background task started)

---

## 4. Search API

### `GET /api/v1/search?q={query}`
Global search across the entire knowledge base.
- **Query Params**: `q` (string, required) - The search term.
- **Response**: `200 OK`
```json
{
  "results": [
    {
      "type": "meeting | transcript | action_item",
      "entity_id": "uuid",
      "meeting_id": "uuid",
      "preview_text": "We discussed the ...",
      "score": 0.95
    }
  ]
}
```

## Error Handling
All APIs use a standardized error format to prevent leaking stack traces:
```json
{
  "message": "Input validation failed",
  "code": "VALIDATION_ERROR",
  "details": [{ "loc": ["body", "title"], "msg": "field required" }]
}
```
