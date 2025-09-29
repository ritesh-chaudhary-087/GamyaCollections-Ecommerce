# Collection Names Configuration

This backend now supports multiple projects using different collection names by setting environment variables.

## How it works

The backend uses a `PROJECT_PREFIX` environment variable to create unique collection names for each project. This allows you to use the same backend codebase for multiple projects without data conflicts.

## Environment Variables

### Required

- `PROJECT_PREFIX` - The prefix for all collection names (default: 'gamya')

### Example

```env
PROJECT_PREFIX=myproject
```

## Collection Names

With `PROJECT_PREFIX=myproject`, the following collections will be created:

- `myproject_users` (instead of `users`)
- `myproject_products` (instead of `products`)
- `myproject_categories` (instead of `categories`)
- `myproject_subcategories` (instead of `subcategories`)
- `myproject_orders` (instead of `orders`)
- `myproject_carts` (instead of `carts`)
- `myproject_contacts` (instead of `contacts`)
- `myproject_reviews` (instead of `reviews`)
- `myproject_issues` (instead of `issues`)

## Usage Examples

### Project 1 (Gamya Collections)

```env
PROJECT_PREFIX=gamya
MONGODB_URI=mongodb://localhost:27017/gamya_db
```

### Project 2 (Another Jewelry Store)

```env
PROJECT_PREFIX=jewelry_store
MONGODB_URI=mongodb://localhost:27017/jewelry_store_db
```

### Project 3 (Fashion Store)

```env
PROJECT_PREFIX=fashion
MONGODB_URI=mongodb://localhost:27017/fashion_db
```

## Benefits

1. **No Data Conflicts**: Each project has its own collection names
2. **Same Codebase**: Use the same backend for multiple projects
3. **Easy Migration**: Just change the environment variables
4. **Database Separation**: Can use the same MongoDB instance with different databases

## Migration

To migrate an existing project:

1. Set the `PROJECT_PREFIX` environment variable
2. Restart the backend server
3. The new collections will be created automatically when data is inserted

## Notes

- The collection names are generated at runtime based on the environment variable
- If `PROJECT_PREFIX` is not set, it defaults to 'gamya'
- All existing functionality remains the same
- No changes needed in the frontend code
