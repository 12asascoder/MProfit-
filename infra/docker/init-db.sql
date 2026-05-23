-- MProfit Next — Database Initialization
-- Creates required extensions and schemas

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS mprofit;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS market;

-- Grant usage
GRANT USAGE ON SCHEMA mprofit TO mprofit_admin;
GRANT USAGE ON SCHEMA audit TO mprofit_admin;
GRANT USAGE ON SCHEMA market TO mprofit_admin;

-- Set default schema
ALTER DATABASE mprofit SET search_path TO mprofit, public;
