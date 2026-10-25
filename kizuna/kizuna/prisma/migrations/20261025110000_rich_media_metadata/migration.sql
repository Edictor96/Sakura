ALTER TABLE "Media"
  ADD COLUMN "originalTitle" TEXT,
  ADD COLUMN "alternateTitles" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "releaseDate" TIMESTAMP(3),
  ADD COLUMN "status" TEXT,
  ADD COLUMN "runtimeMinutes" INTEGER,
  ADD COLUMN "episodeCount" INTEGER,
  ADD COLUMN "season" TEXT,
  ADD COLUMN "language" TEXT,
  ADD COLUMN "country" TEXT,
  ADD COLUMN "score" DOUBLE PRECISION,
  ADD COLUMN "popularity" INTEGER,
  ADD COLUMN "ageRating" TEXT,
  ADD COLUMN "genres" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "themes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "creators" JSONB,
  ADD COLUMN "cast" JSONB,
  ADD COLUMN "relatedMedia" JSONB,
  ADD COLUMN "externalLinks" JSONB;

CREATE TABLE "MediaImage" (
  "id" TEXT NOT NULL,
  "mediaId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "width" INTEGER,
  "height" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaImage_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MediaImage_mediaId_type_provider_key" ON "MediaImage"("mediaId", "type", "provider");
CREATE INDEX "MediaImage_mediaId_type_idx" ON "MediaImage"("mediaId", "type");
ALTER TABLE "MediaImage" ADD CONSTRAINT "MediaImage_mediaId_fkey"
  FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
