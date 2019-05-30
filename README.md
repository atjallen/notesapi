# notes-api
An API that allows you to manage notes

## Prerequisites

- Node.js
- npm
- MongoDB

## How to run

- Clone the repo
- Run `npm install`
- Start a MongoDB instance
- Replace the connection string in `server.js` with the connection string for your instance
- Run `node server.js`

## Instructions to the UX team

The API has the following functionality:

- Retrieve a note
- Retrieve all the notes
- Create a new note
- Update a note
- Delete a note
- Delete all the notes
- Archive a note

All requests and responses should conform to the [JSON:API specification](https://jsonapi.org/). Essentially, to make a request to the API, make the request to the correct URL (either `/notes` or `/notes/[note id]`) and, if the request requires that you include a note as the body, format it as JSON like so:

```json
{
    "data": {
        "id": "[id]",
        "type": "note",
        "attributes": {
            "title": "[Note title]",
            "body": "[Note body]",
            "archived": false
        }
    }
}
```

(`id` is not required if you are creating a new note)

If a note is included in the response to a request, it will be formatted like this also.

### Retrieve a note

```http
GET /notes/[note id]
```

Returns a single note from the database according to its id.

### Retrieve all the notes

```http
GET /notes
```

Returns all the notes in the database. They'll be returned as an array under the `data` key.

### Create a new note

```http
POST /notes
```

Stores the note included in the body of the request in the database.

### Update a note

```http
PATCH /notes/[note id]
```

Updates the note with the corresponding id in the database by replacing it with the note included in the body of the request.

### Delete a note

```http
DELETE /notes/[note id]
```

Delete the note with the corresponding id from the database.

### Delete all the notes

```http
DELETE /notes
```

Delete all the notes from the database.

### Archive a note

```http
PATCH /notes/[note id]
```

Whether a note is archived or not is determined by a flag on each note. Therefore, to archive a note, simply update it and set its `archived` flag to `true`.

## Choice of technology

I chose to use JavaScript and Node.js since they are well established tools for creating backend software and APIs and I was already familiar with them. I chose to use MongoDB since it was simple to use and had a great package for Node.js (Mongoose) for handling queries from within the API. I used Mocha and Chai for testing since they had good tools for testing APIs (chai-http specifically). I considered using
Java to build the API since I had experience in that but I thought that JavaScript would be better since it's already designed for use in the web and I felt that it was more lightweight and therefore appropriate for the task.

## If I had more time

If I had more time I would likely extend the API to have more features, perhaps the option to incorporate some sort of to-do-list feature into the note so that you can have notes and to-do-lists in the same place. I might also store additional information about notes including created date, edited date, colour, etc. I might also rework the archiving feature to store notes in a separate table in the database or separate database entirely so that it's more akin to a traditional archive rather than simply being a UI trick.
