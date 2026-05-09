# Asset API Documentation

## Overview

The Asset API provides endpoints for managing asset types in the Cash Flow Management system. This is a master data API that manages different types of assets (stocks, real estate, vehicles, etc.) that can be used in financial transactions and portfolio tracking.

## Base URL
```
/api/v1/common/assets
```

## Authentication
All asset endpoints require JWT authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Get Asset Types

### Endpoint
```
GET /api/v1/common/assets
```

### Description
Retrieves a paginated list of all asset types available in the system. This is a master data endpoint that returns predefined asset types for use in other parts of the application.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number for pagination |
| limit | integer | No | 10 | Number of items per page |

### Request Example
```bash
curl -X GET "http://localhost:5000/api/v1/common/assets?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### Response Format

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Assets retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "STOCK",
      "name": "Cổ phiếu",
      "type": "FINANCIAL",
      "unit_id": 1,
      "is_deleted": false,
      "created_at": "2026-05-09T09:30:00Z",
      "updated_at": "2026-05-09T09:30:00Z",
      "created_by_user_id": 1,
      "updated_by_user_id": 1
    },
    {
      "id": 2,
      "code": "REAL_ESTATE",
      "name": "Bất động sản",
      "type": "PROPERTY",
      "unit_id": 2,
      "is_deleted": false,
      "created_at": "2026-05-09T09:35:00Z",
      "updated_at": "2026-05-09T09:35:00Z",
      "created_by_user_id": 1,
      "updated_by_user_id": 1
    },
    {
      "id": 3,
      "code": "VEHICLE",
      "name": "Phương tiện giao thông",
      "type": "TRANSPORT",
      "unit_id": 3,
      "is_deleted": false,
      "created_at": "2026-05-09T09:40:00Z",
      "updated_at": "2026-05-09T09:40:00Z",
      "created_by_user_id": 1,
      "updated_by_user_id": 1
    }
  ]
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "status": "error",
  "message": "Access token is required or invalid"
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

### Data Model

#### Asset Object
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique asset identifier |
| code | string | Unique asset code (max 50 chars) |
| name | string | Asset display name (max 255 chars) |
| type | string | Asset category type (max 10 chars) |
| unit_id | integer | Reference to unit measurement |
| is_deleted | boolean | Soft delete flag |
| created_at | string | ISO 8601 timestamp |
| updated_at | string | ISO 8601 timestamp |
| created_by_user_id | integer | User who created the asset |
| updated_by_user_id | integer | User who last updated the asset |

### Asset Types and Categories

#### Asset Categories (type field)
| Type | Description | Examples |
|------|-------------|----------|
| FINANCIAL | Tài sản tài chính | Cổ phiếu, trái phiếu, quỹ đầu tư |
| PROPERTY | Bất động sản | Nhà đất, căn hộ, văn phòng |
| TRANSPORT | Phương tiện giao thông | Ô tô, xe máy, xe đạp |
| TECHNOLOGY | Công nghệ | Máy tính, điện thoại, thiết bị |
| JEWELRY | Trang sức | Vàng, kim cương, đồng hồ |
| ART | Nghệ thuật | Tranh, tượng, đồ cổ |
| COLLECTIBLE | Sưu tầm | Tem, tiền xu, đồ sưu tầm |
| OTHER | Khác | Các loại tài sản khác |

#### Common Asset Codes
| Code | Name | Type | Description |
|------|------|------|-------------|
| STOCK | Cổ phiếu | FINANCIAL | Cổ phiếu công ty |
| BOND | Trái phiếu | FINANCIAL | Trái phiếu chính phủ/doanh nghiệp |
| FUND | Quỹ đầu tư | FINANCIAL | Quỹ mutual/ETF |
| HOUSE | Nhà ở | PROPERTY | Nhà ở, căn hộ |
| LAND | Đất đai | PROPERTY | Đất nền, đất nông nghiệp |
| APARTMENT | Căn hộ | PROPERTY | Căn hộ chung cư |
| CAR | Ô tô | TRANSPORT | Xe hơi, xe tải |
| MOTORCYCLE | Xe máy | TRANSPORT | Xe máy, xe scooter |
| BICYCLE | Xe đạp | TRANSPORT | Xe đạp, xe đạp điện |
| COMPUTER | Máy tính | TECHNOLOGY | PC, laptop, máy chủ |
| PHONE | Điện thoại | TECHNOLOGY | Smartphone, tablet |
| GOLD | Vàng | JEWELRY | Vàng miếng, trang sức vàng |
| DIAMOND | Kim cương | JEWELRY | Kim cương, đá quý |

### Unit Reference (unit_id)
The `unit_id` field references the unit measurement table for standardized units:
- **1**: Cái (individual items)
- **2**: m² (square meters - for property)
- **3**: Cái (vehicles)
- **4**: Cái (technology items)
- **5**: Gram/Cây (for jewelry)
- **6**: Cái (art/collectibles)

### Pagination

The API supports pagination using `page` and `limit` parameters:

- **page**: Page number (starts from 1)
- **limit**: Number of items per page (default: 10, max: 100)

**Example with pagination:**
```bash
GET /api/v1/common/assets?page=2&limit=5
```

### Implementation Details

#### Controller Logic
```python
def list_assets(self):
    params = self._get_pagination_params()  # Extract page/limit
    items = self.asset_service.get_all(page=params['page'], limit=params['limit'])
    data = [i.to_dict() for i in items]
    return self.ok(data=data)
```

#### Service Method
```python
def get_all(self, page: int = 1, limit: int = 10) -> List[ComAsset]:
    return self.repository.find_all(page, limit)
```

### Security Features

1. **JWT Authentication**: Required for all asset operations
2. **Master Data Protection**: Only authorized users can modify asset types
3. **Soft Delete**: Asset types are soft deleted, not permanently removed
4. **Audit Trail**: Created/updated timestamps and user tracking

### Usage Examples

#### JavaScript/TypeScript
```javascript
async function getAssetTypes(page = 1, limit = 10) {
  const token = localStorage.getItem('access_token');
  
  try {
    const response = await fetch(
      `/api/v1/common/assets?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch asset types');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching asset types:', error);
    throw error;
  }
}

// Usage
const assetTypes = await getAssetTypes(1, 10);
console.log('Available asset types:', assetTypes);
```

#### Python
```python
import requests

def get_asset_types(access_token, page=1, limit=10):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    params = {'page': page, 'limit': limit}
    
    response = requests.get(
        'http://localhost:5000/api/v1/common/assets',
        headers=headers,
        params=params
    )
    
    if response.status_code == 200:
        return response.json()['data']
    else:
        response.raise_for_status()

# Usage
asset_types = get_asset_types('your_access_token_here')
print(asset_types)
```

### Common Use Cases

1. **Transaction Forms**: Populate asset type dropdowns in transaction creation
2. **Portfolio Management**: Categorize different types of investments
3. **Financial Reports**: Group assets by type in reports
4. **Asset Tracking**: Track value changes by asset category
5. **Investment Analysis**: Analyze performance by asset type
6. **Tax Reporting**: Categorize assets for tax purposes

### Integration with Other APIs

The Asset API integrates with:

- **Transaction API**: Asset types are used when creating buy/sell transactions
- **Portfolio API**: Asset types categorize portfolio holdings
- **Report API**: Asset types are used for financial reporting
- **Unit API**: Asset units reference the unit measurement system

### Error Handling Best Practices

1. **Network Errors**: Implement retry logic for failed requests
2. **Authentication**: Handle 401 errors by refreshing tokens
3. **Empty Results**: Handle cases where no asset types exist
4. **Pagination**: Implement pagination controls for large datasets
5. **Caching**: Cache asset types since they change infrequently

### Testing

#### Unit Test Example
```python
def test_get_asset_types():
    # Mock authentication
    with patch('modules.common_master.routes.jwt_required_custom'):
        # Mock service
        with patch.object(controller.asset_service, 'get_all') as mock_service:
            mock_asset = ComAsset()
            mock_asset.id = 1
            mock_asset.code = "STOCK"
            mock_asset.name = "Cổ phiếu"
            mock_asset.type = "FINANCIAL"
            mock_service.return_value = [mock_asset]
            
            # Test the endpoint
            response = client.get('/api/v1/common/assets', headers={
                'Authorization': 'Bearer test_token'
            })
            
            assert response.status_code == 200
            data = response.get_json()
            assert len(data['data']) == 1
            assert data['data'][0]['code'] == "STOCK"
```

### Performance Considerations

1. **Database Indexing**: Ensure `code` and `type` fields are indexed
2. **Caching**: Implement caching for asset types (master data changes infrequently)
3. **Pagination Limits**: Implement reasonable page size limits
4. **Query Optimization**: Use efficient database queries

### Data Seeding

Asset types are typically seeded during database initialization:

```sql
INSERT INTO com_asset (code, name, type, unit_id) VALUES
('STOCK', 'Cổ phiếu', 'FINANCIAL', 1),
('BOND', 'Trái phiếu', 'FINANCIAL', 1),
('HOUSE', 'Nhà ở', 'PROPERTY', 2),
('LAND', 'Đất đai', 'PROPERTY', 2),
('CAR', 'Ô tô', 'TRANSPORT', 3),
('MOTORCYCLE', 'Xe máy', 'TRANSPORT', 3),
('COMPUTER', 'Máy tính', 'TECHNOLOGY', 4),
('PHONE', 'Điện thoại', 'TECHNOLOGY', 4),
('GOLD', 'Vàng', 'JEWELRY', 5),
('DIAMOND', 'Kim cương', 'JEWELRY', 5);
```

### Related Endpoints

- `POST /api/v1/common/assets` - Create new asset type
- `GET /api/v1/common/assets/{id}` - Get specific asset type
- `PUT /api/v1/common/assets/{id}` - Update asset type
- `DELETE /api/v1/common/assets/{id}` - Delete asset type

---

## Quick Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/assets` | List all asset types | Yes |
| POST | `/assets` | Create asset type | Yes |
| GET | `/assets/{id}` | Get asset type details | Yes |
| PUT | `/assets/{id}` | Update asset type | Yes |
| DELETE | `/assets/{id}` | Delete asset type | Yes |

## Master Data vs User Data

**Important**: Asset types are master data (system-wide) rather than user-specific data. All users see the same list of asset types, unlike wallets which are user-specific.

For more information about other master data endpoints, see the complete API documentation.
