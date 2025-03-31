
 
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keycloak_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_moderator BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);



CREATE TABLE galaxies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    position INT NOT NULL,
    special_attributes JSONB
);



CREATE TABLE solar_systems (
    id SERIAL PRIMARY KEY,
    galaxy_id INT REFERENCES galaxies(id) ON DELETE CASCADE,
    position INT NOT NULL,
    name VARCHAR(50),
    special_attributes JSONB,
    UNIQUE (galaxy_id, position)
);

CREATE TABLE planets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solar_system_id INT REFERENCES solar_systems(id) ON DELETE CASCADE,
    position INT NOT NULL,
    name VARCHAR(50),
    type VARCHAR(20) NOT NULL, -- e.g., 'desert', 'ice', 'terran'
    size INT NOT NULL,
    temperature_range INT[] NOT NULL, -- [min, max]
    fields_total INT NOT NULL, -- max building slots
    fields_used INT DEFAULT 0,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_homeworld BOOLEAN DEFAULT FALSE,
    is_colonized BOOLEAN DEFAULT FALSE,
    is_npc BOOLEAN DEFAULT FALSE,
    npc_faction_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    special_attributes JSONB,
    UNIQUE (solar_system_id, position)
);




CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planet_id UUID REFERENCES planets(id) ON DELETE CASCADE,
    metal BIGINT DEFAULT 500,
    crystal BIGINT DEFAULT 500,
    deuterium BIGINT DEFAULT 0,
    energy_available INT DEFAULT 0,
    energy_used INT DEFAULT 0,
    research_points INT DEFAULT 0,
    influence_points INT DEFAULT 0,
    metal_storage_capacity BIGINT DEFAULT 10000,
    crystal_storage_capacity BIGINT DEFAULT 10000,
    deuterium_storage_capacity BIGINT DEFAULT 10000,
    metal_production_per_hour INT DEFAULT 20,
    crystal_production_per_hour INT DEFAULT 10,
    deuterium_production_per_hour INT DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (planet_id)
);



CREATE TABLE building_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(20) NOT NULL, -- 'resource', 'facility', 'special'
    description TEXT,
    base_cost JSONB NOT NULL, -- {metal: 100, crystal: 50, deuterium: 0}
    base_production JSONB, -- for resource buildings
    production_type VARCHAR(20), -- 'metal', 'crystal', 'deuterium', 'energy', etc.
    cost_factor FLOAT NOT NULL, -- how much cost increases per level
    energy_usage INT DEFAULT 0, -- base energy consumption
    energy_production INT DEFAULT 0, -- base energy production
    prerequisites JSONB, -- {buildings: {building_type_id: level}, research: {research_type_id: level}}
    build_time_base INT NOT NULL, -- base time in seconds
    special_attributes JSONB
);

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planet_id UUID REFERENCES planets(id) ON DELETE CASCADE,
    building_type_id INT REFERENCES building_types(id) ON DELETE CASCADE,
    level INT DEFAULT 0,
    is_upgrading BOOLEAN DEFAULT FALSE,
    upgrade_finish_time TIMESTAMP WITH TIME ZONE,
    damage_level INT DEFAULT 0, -- for invasion mechanics
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (planet_id, building_type_id)
);




CREATE TABLE research_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(30) NOT NULL, -- 'military', 'utility', 'invasion', 'npc_interaction'
    description TEXT,
    base_cost JSONB NOT NULL, -- {metal: 100, crystal: 50, deuterium: 0}
    cost_factor FLOAT NOT NULL, -- how much cost increases per level
    research_time_base INT NOT NULL, -- base time in seconds
    max_level INT,
    prerequisites JSONB, -- {buildings: {building_type_id: level}, research: {research_type_id: level}}
    special_attributes JSONB
);

CREATE TABLE research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    research_type_id INT REFERENCES research_types(id) ON DELETE CASCADE,
    level INT DEFAULT 0,
    is_researching BOOLEAN DEFAULT FALSE,
    research_finish_time TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, research_type_id)
);



CREATE TABLE unit_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(20) NOT NULL, -- 'ship', 'defense', 'invasion_unit'
    type VARCHAR(20) NOT NULL, -- 'combat', 'transport', 'special'
    description TEXT,
    base_cost JSONB NOT NULL, -- {metal: 100, crystal: 50, deuterium: 0}
    build_time_base INT NOT NULL, -- base time in seconds
    combat_attributes JSONB, -- {weapons: 100, shields: 50, armor: 25}
    cargo_capacity INT DEFAULT 0,
    speed INT DEFAULT 0,
    fuel_consumption INT DEFAULT 0,
    prerequisites JSONB, -- {buildings: {}, research: {}}
    special_attributes JSONB
);

CREATE TABLE fleet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planet_id UUID REFERENCES planets(id) ON DELETE CASCADE,
    unit_type_id INT REFERENCES unit_types(id) ON DELETE CASCADE,
    quantity INT DEFAULT 0,
    in_construction INT DEFAULT 0,
    construction_finish_time TIMESTAMP WITH TIME ZONE,
    UNIQUE (planet_id, unit_type_id)
);

CREATE TABLE defense (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planet_id UUID REFERENCES planets(id) ON DELETE CASCADE,
    unit_type_id INT REFERENCES unit_types(id) ON DELETE CASCADE,
    quantity INT DEFAULT 0,
    in_construction INT DEFAULT 0,
    construction_finish_time TIMESTAMP WITH TIME ZONE,
    UNIQUE (planet_id, unit_type_id)
);




CREATE TABLE npc_factions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    faction_type VARCHAR(30) NOT NULL, -- 'trading', 'militant', 'technological', 'ancient'
    behavior_pattern VARCHAR(30) NOT NULL, -- 'defensive', 'aggressive', 'neutral', 'reactive'
    strength_level INT NOT NULL,
    description TEXT,
    special_bonuses JSONB,
    special_attributes JSONB
);

CREATE TABLE npc_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    faction_id INT REFERENCES npc_factions(id) ON DELETE CASCADE,
    reputation_level INT DEFAULT 0, -- negative for hostile, positive for friendly
    diplomatic_status VARCHAR(30) DEFAULT 'neutral', -- 'neutral', 'friendly', 'hostile', 'trade_partner'
    last_interaction TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, faction_id)
);




CREATE TABLE mission_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    special_attributes JSONB
);

CREATE TABLE fleet_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mission_type_id INT REFERENCES mission_types(id),
    origin_planet_id UUID REFERENCES planets(id),
    target_planet_id UUID REFERENCES planets(id),
    fleet_composition JSONB NOT NULL, -- {unit_type_id: quantity}
    resources JSONB, -- {metal: 0, crystal: 0, deuterium: 0}
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    return_time TIMESTAMP WITH TIME ZONE,
    mission_status VARCHAR(20) DEFAULT 'preparing', -- 'preparing', 'outbound', 'executing', 'returning', 'completed'
    is_returning BOOLEAN DEFAULT FALSE,
    special_attributes JSONB
);




CREATE TABLE invasions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fleet_mission_id UUID REFERENCES fleet_missions(id) ON DELETE CASCADE,
    planet_id UUID REFERENCES planets(id),
    attacker_id UUID REFERENCES users(id),
    defender_id UUID REFERENCES users(id),
    invasion_phase VARCHAR(20) DEFAULT 'initial', -- 'initial', 'ground_assault', 'occupation', 'integration'
    occupation_start_time TIMESTAMP WITH TIME ZONE,
    resistance_level INT DEFAULT 100, -- percentage of resistance
    infrastructure_damage INT DEFAULT 0, -- percentage of damage
    resource_extraction_rate FLOAT DEFAULT 0.0, -- percentage of resources being extracted
    occupation_units JSONB, -- {unit_type_id: quantity}
    special_attributes JSONB,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'repelled', 'successful', 'liberated'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    related_entity_type VARCHAR(50), -- 'planet', 'research', 'building', 'fleet', 'invasion'
    related_entity_id UUID,
    event_data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE game_settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE battle_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fleet_mission_id UUID REFERENCES fleet_missions(id),
    invasion_id UUID REFERENCES invasions(id),
    attacker_id UUID REFERENCES users(id),
    defender_id UUID REFERENCES users(id),
    attacker_fleet_before JSONB,
    defender_fleet_before JSONB,
    attacker_fleet_after JSONB,
    defender_fleet_after JSONB,
    resources_captured JSONB,
    debris_field JSONB,
    combat_rounds JSONB,
    result VARCHAR(20), -- 'attacker_victory', 'defender_victory', 'draw'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
