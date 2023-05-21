# I. RUN APP
`npm start`

# II. BUILD APP
`npm run build`

# III. ORM: KNEX 
## 1. MIGRATIONS
### 1.1 CREATE
- *Bước 1*: Mở Terminal trong thư mục src/db
- *Bước 2*: Chạy lệnh `knex migrate:make migration_name` với migration_name là tên của migration muốn đặt.
- *Ví dụ*: 
  - `knex migrate: User` 
  - `knex migrate: Add_Column_Type_To_User`

### 1.2 RUN
- *Bước 1*: Mở Terminal trong thư mục src/db
- *Bước 2*: Chạy lệnh `knex migrate:latest`

## 2. SEEDS
### 2.1 CREATE
- *Bước 1*: Mở Terminal trong thư mục src/db
- *Bước 2*: Chạy lệnh `knex seed:make seed_name` với seed_name là tên của seed muốn đặt.
- *Ví dụ*: 
  - `knex seed:make Employee` 
  - `knex seed:make SystemParameter`

### 2.2 RUN
#### 2.2.1 ALL FILE
- *Bước 1*: Mở Terminal trong thư mục src/db
- *Bước 2*: Chạy lệnh `knex seed:run`

#### 2.2.2 SPECIFIC FILE
- *Bước 1*: Mở Terminal trong thư mục src/db
- *Bước 2*: Chạy lệnh 
`knex seed:run --specific=seed-filename.js --specific=another-seed-filename.js`
- *Ví dụ*: 
  - `knex seed:run --specific=Employee.js` 
  - `knex seed:run --specific=Employee.js --specific=SystemParameter.js`

# IV. ROLLBACK SERVER
`npm run knex-clear`