-- Apatheia Labs — Phronesis Platform
-- Supabase Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- CORE TABLES
-- ============================================

-- Cases
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    case_type TEXT NOT NULL CHECK (case_type IN ('family_court', 'regulatory', 'criminal', 'civil', 'media')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    -- File info
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT,
    storage_path TEXT NOT NULL,
    
    -- Forensic integrity
    hash_sha256 TEXT NOT NULL,
    acquisition_date TIMESTAMPTZ DEFAULT NOW(),
    
    -- Classification
    doc_type TEXT CHECK (doc_type IN (
        'court_order', 'witness_statement', 'expert_report', 'police_bundle',
        'social_work_assessment', 'transcript', 'correspondence', 'media',
        'disclosure', 'threshold_document', 'position_statement', 'other'
    )),
    source_entity TEXT,
    
    -- Processing status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    extracted_text TEXT,
    page_count INTEGER,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document chunks for search
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    page_number INTEGER,
    
    -- Vector embedding for semantic search
    embedding vector(1536),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENTITY TRACKING
-- ============================================

-- Entities (people, organizations, etc.)
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    canonical_name TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'person', 'organization', 'professional', 'institution',
        'court', 'police', 'social_services', 'expert', 'media', 'other'
    )),
    
    -- Aliases
    aliases TEXT[] DEFAULT '{}',
    
    -- Role in case
    role TEXT,
    institution TEXT,
    professional_registration TEXT,
    
    -- Credibility tracking
    credibility_score DECIMAL(3,2) DEFAULT 0.50,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(case_id, canonical_name)
);

-- Entity mentions in documents
CREATE TABLE entity_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_id UUID REFERENCES document_chunks(id) ON DELETE CASCADE,
    
    mention_text TEXT NOT NULL,
    context TEXT,
    page_number INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLAIMS & EVIDENCE
-- ============================================

-- Claims (institutional assertions)
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    claim_text TEXT NOT NULL,
    claim_type TEXT CHECK (claim_type IN (
        'factual', 'opinion', 'finding', 'recommendation', 'conclusion', 'allegation'
    )),
    
    -- Source
    source_entity_id UUID REFERENCES entities(id),
    source_document_id UUID REFERENCES documents(id),
    source_page INTEGER,
    
    -- Analysis
    foundation_type TEXT CHECK (foundation_type IN (
        'verified', 'supported', 'unsupported', 'contested', 
        'circular', 'contaminated', 'unfounded'
    )),
    confidence_score DECIMAL(3,2),
    
    -- Temporal
    claim_date DATE,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence sources
CREATE TABLE evidence_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    evidence_number TEXT NOT NULL,
    description TEXT NOT NULL,
    document_id UUID REFERENCES documents(id),
    
    -- Classification
    source_type TEXT CHECK (source_type IN (
        'primary', 'secondary', 'derivative', 'hearsay', 'expert_opinion'
    )),
    reliability_score DECIMAL(3,2),
    
    -- Forensic
    acquisition_date TIMESTAMPTZ,
    acquired_by TEXT,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(case_id, evidence_number)
);

-- Evidence chains (claim -> evidence relationships)
CREATE TABLE evidence_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    evidence_id UUID REFERENCES evidence_sources(id) ON DELETE CASCADE,
    
    relationship_type TEXT NOT NULL CHECK (relationship_type IN (
        'supports', 'contradicts', 'undermines', 'relies_on', 
        'derived_from', 'ignores', 'misrepresents'
    )),
    strength TEXT CHECK (strength IN ('definitive', 'strong', 'moderate', 'weak', 'asserted')),
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANALYSIS FINDINGS
-- ============================================

-- Contradictions
CREATE TABLE contradictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    -- Source A
    source_a_document_id UUID REFERENCES documents(id),
    source_a_entity_id UUID REFERENCES entities(id),
    source_a_text TEXT NOT NULL,
    source_a_page INTEGER,
    source_a_date DATE,
    
    -- Source B
    source_b_document_id UUID REFERENCES documents(id),
    source_b_entity_id UUID REFERENCES entities(id),
    source_b_text TEXT NOT NULL,
    source_b_page INTEGER,
    source_b_date DATE,
    
    -- Analysis
    contradiction_type TEXT CHECK (contradiction_type IN (
        'direct', 'temporal', 'logical', 'omission', 'emphasis'
    )),
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    resolution TEXT,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Omissions
CREATE TABLE omissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    -- What was omitted
    omitted_content TEXT NOT NULL,
    source_document_id UUID REFERENCES documents(id),
    source_page INTEGER,
    
    -- Where it was omitted from
    omitting_document_id UUID REFERENCES documents(id),
    omitting_entity_id UUID REFERENCES entities(id),
    
    -- Analysis
    omission_type TEXT CHECK (omission_type IN (
        'selective_quoting', 'complete_exclusion', 'context_stripping', 'cherry_picking'
    )),
    bias_direction TEXT,
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Findings (general analysis results)
CREATE TABLE findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    engine TEXT NOT NULL CHECK (engine IN (
        'entity_resolution', 'temporal_parser', 'argumentation', 'bias_detection',
        'contradiction', 'accountability', 'professional_tracker', 'omission',
        'expert_witness', 'documentary', 'narrative', 'coordination', 'evidence_chain'
    )),
    
    title TEXT NOT NULL,
    description TEXT,
    
    -- Classification
    finding_type TEXT,
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    
    -- References
    document_ids UUID[] DEFAULT '{}',
    entity_ids UUID[] DEFAULT '{}',
    
    -- Regulatory relevance
    regulatory_targets TEXT[] DEFAULT '{}',
    
    -- Evidence
    evidence JSONB DEFAULT '{}',
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TIMELINE & NARRATIVE
-- ============================================

-- Timeline events
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    event_date DATE NOT NULL,
    event_time TIME,
    date_precision TEXT DEFAULT 'day' CHECK (date_precision IN ('exact', 'day', 'week', 'month', 'quarter', 'year')),
    
    description TEXT NOT NULL,
    event_type TEXT,
    
    -- Source
    source_document_id UUID REFERENCES documents(id),
    source_page INTEGER,
    
    -- Related entities
    entity_ids UUID[] DEFAULT '{}',
    
    -- Anomaly detection
    is_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_type TEXT,
    anomaly_notes TEXT,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Narrative versions (tracking claim evolution)
CREATE TABLE narrative_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    claim_subject TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    
    claim_text TEXT NOT NULL,
    source_document_id UUID REFERENCES documents(id),
    source_entity_id UUID REFERENCES entities(id),
    claim_date DATE,
    
    -- Drift analysis
    drift_type TEXT CHECK (drift_type IN (
        'stable', 'amplification', 'minimization', 'emergence', 'disappearance', 'mutation'
    )),
    previous_version_id UUID REFERENCES narrative_versions(id),
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REGULATORY SUBMISSIONS
-- ============================================

-- Regulatory complaints
CREATE TABLE regulatory_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    
    regulator TEXT NOT NULL CHECK (regulator IN (
        'ofcom', 'iopc', 'lgo', 'ico', 'hcpc', 'bps', 'ofsted', 'sra', 'gmc', 'nmc'
    )),
    
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_preparation', 'filed', 'acknowledged', 'investigating', 'concluded')),
    
    reference_number TEXT,
    filed_date DATE,
    
    -- Content
    title TEXT NOT NULL,
    summary TEXT,
    content_markdown TEXT,
    
    -- Related findings
    finding_ids UUID[] DEFAULT '{}',
    
    -- Documents
    supporting_document_ids UUID[] DEFAULT '{}',
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Full-text search indexes
CREATE INDEX idx_documents_text ON documents USING gin(to_tsvector('english', extracted_text));
CREATE INDEX idx_chunks_content ON document_chunks USING gin(to_tsvector('english', content));
CREATE INDEX idx_claims_text ON claims USING gin(to_tsvector('english', claim_text));

-- Vector search index
CREATE INDEX idx_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Foreign key indexes
CREATE INDEX idx_documents_case ON documents(case_id);
CREATE INDEX idx_entities_case ON entities(case_id);
CREATE INDEX idx_claims_case ON claims(case_id);
CREATE INDEX idx_findings_case ON findings(case_id);
CREATE INDEX idx_contradictions_case ON contradictions(case_id);

-- Timestamp indexes
CREATE INDEX idx_documents_created ON documents(created_at DESC);
CREATE INDEX idx_findings_created ON findings(created_at DESC);
CREATE INDEX idx_timeline_date ON timeline_events(event_date);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Full-text search function
CREATE OR REPLACE FUNCTION search_documents(
    search_query TEXT,
    case_filter UUID DEFAULT NULL
)
RETURNS TABLE (
    document_id UUID,
    filename TEXT,
    doc_type TEXT,
    relevance REAL,
    headline TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.filename,
        d.doc_type,
        ts_rank(to_tsvector('english', d.extracted_text), plainto_tsquery('english', search_query)) as relevance,
        ts_headline('english', d.extracted_text, plainto_tsquery('english', search_query), 'MaxWords=50, MinWords=25') as headline
    FROM documents d
    WHERE 
        to_tsvector('english', d.extracted_text) @@ plainto_tsquery('english', search_query)
        AND (case_filter IS NULL OR d.case_id = case_filter)
    ORDER BY relevance DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Semantic search function
CREATE OR REPLACE FUNCTION search_semantic(
    query_embedding vector(1536),
    case_filter UUID DEFAULT NULL,
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 20
)
RETURNS TABLE (
    chunk_id UUID,
    document_id UUID,
    content TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dc.id,
        dc.document_id,
        dc.content,
        1 - (dc.embedding <=> query_embedding) as similarity
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.id
    WHERE 
        1 - (dc.embedding <=> query_embedding) > match_threshold
        AND (case_filter IS NULL OR d.case_id = case_filter)
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON entities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON regulatory_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (for future multi-user)
-- ============================================

-- Enable RLS on all tables (but allow all for now)
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;

-- Permissive policies (single user)
CREATE POLICY "Allow all" ON cases FOR ALL USING (true);
CREATE POLICY "Allow all" ON documents FOR ALL USING (true);
CREATE POLICY "Allow all" ON entities FOR ALL USING (true);
CREATE POLICY "Allow all" ON claims FOR ALL USING (true);
CREATE POLICY "Allow all" ON findings FOR ALL USING (true);

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Insert a sample case for testing
INSERT INTO cases (reference, name, case_type, description) VALUES
('PE23C50095', 'Family Court Proceedings', 'family_court', 'Primary case for forensic analysis');
