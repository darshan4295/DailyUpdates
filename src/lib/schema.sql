CREATE TABLE profiles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) CHECK (role IN ('employee', 'manager')),
    team VARCHAR(255)
);

CREATE TABLE updates (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES profiles(id),
    date DATE NOT NULL,
    accomplishments TEXT,
    carry_forward TEXT,
    today_plans TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
