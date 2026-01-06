-- Entity Resolution Engine: Entity Linkages Table
-- Migration to add entity_linkages table for storing match proposals and user feedback

-- ============================================
-- ENTITY LINKAGES TABLE
-- ============================================

-- Entity linkages (proposed and confirmed entity matches)
CREATE TABLE entity_linkages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Entity pair being linked
    entity_a_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    entity_b_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,

    -- Match analysis
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    algorithm TEXT NOT NULL CHECK (algorithm IN ('levenshtein', 'fuzzy', 'user_confirmed', 'exact', 'alias')),

    -- Review status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate linkages (order-independent)
    CONSTRAINT unique_entity_pair UNIQUE (entity_a_id, entity_b_id),

    -- Prevent self-linkage
    CONSTRAINT no_self_linkage CHECK (entity_a_id != entity_b_id)
);

-- Comment on table
COMMENT ON TABLE entity_linkages IS 'Stores proposed and confirmed entity linkages for entity resolution engine';
COMMENT ON COLUMN entity_linkages.confidence IS 'Match confidence score from 0 to 1 (0.8+ high, 0.5-0.8 medium, <0.5 low)';
COMMENT ON COLUMN entity_linkages.algorithm IS 'Algorithm used to identify the match: levenshtein, fuzzy, user_confirmed, exact, alias';
COMMENT ON COLUMN entity_linkages.status IS 'Review status: pending (awaiting review), confirmed (user verified), rejected (user dismissed)';
