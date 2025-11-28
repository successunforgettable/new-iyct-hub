-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'COACH', 'CLIENT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('AKU', 'BTF', 'SMB', 'STF', 'CERTIFICATION', 'PERSONALITY');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'INSTALLMENT', 'FREE', 'TRIAL');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('STRIPE', 'CASHFREE');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('FULL', 'INSTALLMENT', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('NOT_STARTED', 'SUBMITTED', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "fullName" TEXT NOT NULL,
    "userRole" "UserRole" NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "language" TEXT NOT NULL DEFAULT 'en',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "googleId" TEXT,
    "facebookId" TEXT,
    "oauthProvider" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentTimestamp" TIMESTAMP(3),
    "consentIp" TEXT,
    "dataRetentionDays" INTEGER NOT NULL DEFAULT 365,
    "scheduledDeletionDate" TIMESTAMP(3),
    "parentCoachId" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jwtToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deviceInfo" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "programType" "ProgramType" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "welcomeMessage" TEXT,
    "termsConditions" TEXT,
    "supportEmail" TEXT,
    "durationWeeks" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "requiresCertification" BOOLEAN NOT NULL DEFAULT false,
    "basePriceUsd" DECIMAL(10,2),
    "basePriceInr" DECIMAL(10,2),
    "basePriceAed" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_weeks" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "objectives" TEXT[],
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockAfterWeek" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_weeks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_steps" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "contentType" TEXT,
    "contentUrl" TEXT,
    "contentHtml" TEXT,
    "durationMinutes" INTEGER,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "submissionType" TEXT,
    "maxFileSizeMb" INTEGER,
    "allowedFileTypes" TEXT[],
    "usesAiGeneration" BOOLEAN NOT NULL DEFAULT false,
    "aiPromptTemplate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_program_enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enrollmentStatus" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'FREE',
    "accessGrantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessExpiresAt" TIMESTAMP(3),
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "lastActivityAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_program_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_step_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
    "submissionText" TEXT,
    "submissionFileUrl" TEXT,
    "submissionMetadata" JSONB,
    "aiGeneratedContent" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_step_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inner_dna_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalityType" INTEGER,
    "wing" TEXT,
    "subtype" TEXT,
    "blindSubtype" TEXT,
    "states" JSONB,
    "innerDnaUserId" TEXT,
    "rawResponse" JSONB,
    "testCompletedAt" TIMESTAMP(3),
    "testVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inner_dna_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_generated_content" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentSubtype" TEXT,
    "personalityContext" JSONB,
    "inputData" JSONB,
    "promptTemplate" TEXT,
    "generatedContent" TEXT NOT NULL,
    "formattedHtml" TEXT,
    "modelVersion" TEXT,
    "tokensUsed" INTEGER,
    "generationTimeMs" INTEGER,
    "costUsd" DECIMAL(10,4),
    "isCached" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "cacheKey" TEXT,
    "userEdited" BOOLEAN NOT NULL DEFAULT false,
    "userApproved" BOOLEAN NOT NULL DEFAULT false,
    "regenerationCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_generated_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wheel_of_life" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "innerDnaId" TEXT,
    "health" INTEGER NOT NULL,
    "friendsFamily" INTEGER NOT NULL,
    "funRecreation" INTEGER NOT NULL,
    "wealth" INTEGER NOT NULL,
    "relationship" INTEGER NOT NULL,
    "learningGrowth" INTEGER NOT NULL,
    "possessions" INTEGER NOT NULL,
    "career" INTEGER NOT NULL,
    "aiInsightsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wheel_of_life_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_baselines" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "innerDnaId" TEXT,
    "baselineWords" TEXT[],
    "wordRankings" INTEGER[],
    "baselineExpressions" JSONB,
    "expressionRatings" JSONB,
    "aiVisionsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_baselines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_ncodes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "innerDnaId" TEXT,
    "ncodeStatement" TEXT NOT NULL,
    "ncodeRanking" INTEGER,
    "ecodeStatement" TEXT NOT NULL,
    "lifeAreaImpacts" JSONB,
    "fiveYearPrediction" TEXT,
    "aiPredictionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_ncodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_outcomes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "outcomeTitle" TEXT NOT NULL,
    "outcomeDescription" TEXT,
    "outcomeRank" INTEGER NOT NULL,
    "incredSteps" JSONB,
    "aiIncredId" TEXT,
    "challenges" JSONB,
    "powerLeaps" JSONB,
    "aiChallengesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buzz_moments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "momentDescription" TEXT NOT NULL,
    "isAiSuggested" BOOLEAN NOT NULL DEFAULT false,
    "aiContentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buzz_moments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_plans" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "priceUsd" DECIMAL(10,2),
    "priceInr" DECIMAL(10,2),
    "priceAed" DECIMAL(10,2),
    "installmentCount" INTEGER,
    "installmentFrequency" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "planId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentGateway" "PaymentGateway" NOT NULL,
    "gatewayTransactionId" TEXT,
    "gatewayPaymentMethod" TEXT,
    "gatewayResponse" JSONB,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "taxRate" DECIMAL(5,2),
    "taxAmount" DECIMAL(10,2),
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "isInstallment" BOOLEAN NOT NULL DEFAULT false,
    "installmentNumber" INTEGER,
    "totalInstallments" INTEGER,
    "paymentMetadata" JSONB,
    "ipAddress" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT,
    "userId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "pdfUrl" TEXT,
    "pdfGeneratedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT,
    "certificationType" TEXT,
    "certificationNumber" TEXT,
    "status" "CertificationStatus" NOT NULL DEFAULT 'PENDING',
    "certificatePdfUrl" TEXT,
    "certificateIssuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_videos" (
    "id" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "videoThumbnailUrl" TEXT,
    "durationSeconds" INTEGER,
    "status" "CertificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerId" TEXT,
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "aiAnalysis" JSONB,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certification_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kyc_documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT,
    "frontImageUrl" TEXT,
    "backImageUrl" TEXT,
    "selfieUrl" TEXT,
    "status" "KYCStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentTimestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "adminUserId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventCategory" TEXT,
    "eventDescription" TEXT,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "changes" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "requestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gdpr_data_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "requestStatus" TEXT NOT NULL DEFAULT 'pending',
    "processedById" TEXT,
    "processedAt" TIMESTAMP(3),
    "exportFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gdpr_data_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSizeBytes" BIGINT,
    "mimeType" TEXT,
    "storageProvider" TEXT NOT NULL DEFAULT 'aws_s3',
    "storageKey" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "uploadedById" TEXT,
    "fileCategory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_facebookId_key" ON "users"("facebookId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_googleId_idx" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "users_userRole_idx" ON "users"("userRole");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_parentCoachId_idx" ON "users"("parentCoachId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_userId_roleName_key" ON "admin_roles"("userId", "roleName");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_jwtToken_idx" ON "user_sessions"("jwtToken");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slug_key" ON "programs"("slug");

-- CreateIndex
CREATE INDEX "programs_programType_idx" ON "programs"("programType");

-- CreateIndex
CREATE INDEX "programs_language_idx" ON "programs"("language");

-- CreateIndex
CREATE INDEX "programs_isPublished_idx" ON "programs"("isPublished");

-- CreateIndex
CREATE INDEX "program_weeks_programId_idx" ON "program_weeks"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "program_weeks_programId_weekNumber_key" ON "program_weeks"("programId", "weekNumber");

-- CreateIndex
CREATE INDEX "program_steps_weekId_idx" ON "program_steps"("weekId");

-- CreateIndex
CREATE UNIQUE INDEX "program_steps_weekId_stepNumber_key" ON "program_steps"("weekId", "stepNumber");

-- CreateIndex
CREATE INDEX "user_program_enrollment_userId_idx" ON "user_program_enrollment"("userId");

-- CreateIndex
CREATE INDEX "user_program_enrollment_programId_idx" ON "user_program_enrollment"("programId");

-- CreateIndex
CREATE INDEX "user_program_enrollment_enrollmentStatus_idx" ON "user_program_enrollment"("enrollmentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "user_program_enrollment_userId_programId_key" ON "user_program_enrollment"("userId", "programId");

-- CreateIndex
CREATE INDEX "user_step_progress_userId_idx" ON "user_step_progress"("userId");

-- CreateIndex
CREATE INDEX "user_step_progress_stepId_idx" ON "user_step_progress"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "user_step_progress_userId_stepId_key" ON "user_step_progress"("userId", "stepId");

-- CreateIndex
CREATE UNIQUE INDEX "inner_dna_results_userId_key" ON "inner_dna_results"("userId");

-- CreateIndex
CREATE INDEX "inner_dna_results_personalityType_idx" ON "inner_dna_results"("personalityType");

-- CreateIndex
CREATE UNIQUE INDEX "ai_generated_content_cacheKey_key" ON "ai_generated_content"("cacheKey");

-- CreateIndex
CREATE INDEX "ai_generated_content_userId_idx" ON "ai_generated_content"("userId");

-- CreateIndex
CREATE INDEX "ai_generated_content_contentType_idx" ON "ai_generated_content"("contentType");

-- CreateIndex
CREATE INDEX "ai_generated_content_cacheKey_idx" ON "ai_generated_content"("cacheKey");

-- CreateIndex
CREATE INDEX "ai_generated_content_expiresAt_idx" ON "ai_generated_content"("expiresAt");

-- CreateIndex
CREATE INDEX "wheel_of_life_userId_idx" ON "wheel_of_life"("userId");

-- CreateIndex
CREATE INDEX "user_baselines_userId_idx" ON "user_baselines"("userId");

-- CreateIndex
CREATE INDEX "user_ncodes_userId_idx" ON "user_ncodes"("userId");

-- CreateIndex
CREATE INDEX "user_outcomes_userId_idx" ON "user_outcomes"("userId");

-- CreateIndex
CREATE INDEX "buzz_moments_userId_idx" ON "buzz_moments"("userId");

-- CreateIndex
CREATE INDEX "pricing_plans_programId_idx" ON "pricing_plans"("programId");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "payments_enrollmentId_idx" ON "payments"("enrollmentId");

-- CreateIndex
CREATE INDEX "payments_gatewayTransactionId_idx" ON "payments"("gatewayTransactionId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_userId_idx" ON "invoices"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "certifications_certificationNumber_key" ON "certifications"("certificationNumber");

-- CreateIndex
CREATE INDEX "certifications_userId_idx" ON "certifications"("userId");

-- CreateIndex
CREATE INDEX "certifications_status_idx" ON "certifications"("status");

-- CreateIndex
CREATE INDEX "certification_videos_certificationId_idx" ON "certification_videos"("certificationId");

-- CreateIndex
CREATE INDEX "certification_videos_status_idx" ON "certification_videos"("status");

-- CreateIndex
CREATE INDEX "kyc_documents_userId_idx" ON "kyc_documents"("userId");

-- CreateIndex
CREATE INDEX "kyc_documents_status_idx" ON "kyc_documents"("status");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_eventType_idx" ON "audit_logs"("eventType");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "gdpr_data_requests_userId_idx" ON "gdpr_data_requests"("userId");

-- CreateIndex
CREATE INDEX "gdpr_data_requests_requestStatus_idx" ON "gdpr_data_requests"("requestStatus");

-- CreateIndex
CREATE INDEX "files_userId_idx" ON "files"("userId");

-- CreateIndex
CREATE INDEX "files_fileCategory_idx" ON "files"("fileCategory");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_parentCoachId_fkey" FOREIGN KEY ("parentCoachId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_weeks" ADD CONSTRAINT "program_weeks_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_steps" ADD CONSTRAINT "program_steps_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "program_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "program_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_program_enrollment" ADD CONSTRAINT "user_program_enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_program_enrollment" ADD CONSTRAINT "user_program_enrollment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_step_progress" ADD CONSTRAINT "user_step_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_step_progress" ADD CONSTRAINT "user_step_progress_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "program_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_step_progress" ADD CONSTRAINT "user_step_progress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "user_program_enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inner_dna_results" ADD CONSTRAINT "inner_dna_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generated_content" ADD CONSTRAINT "ai_generated_content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wheel_of_life" ADD CONSTRAINT "wheel_of_life_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wheel_of_life" ADD CONSTRAINT "wheel_of_life_innerDnaId_fkey" FOREIGN KEY ("innerDnaId") REFERENCES "inner_dna_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_baselines" ADD CONSTRAINT "user_baselines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_baselines" ADD CONSTRAINT "user_baselines_innerDnaId_fkey" FOREIGN KEY ("innerDnaId") REFERENCES "inner_dna_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ncodes" ADD CONSTRAINT "user_ncodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ncodes" ADD CONSTRAINT "user_ncodes_innerDnaId_fkey" FOREIGN KEY ("innerDnaId") REFERENCES "inner_dna_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_outcomes" ADD CONSTRAINT "user_outcomes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buzz_moments" ADD CONSTRAINT "buzz_moments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_plans" ADD CONSTRAINT "pricing_plans_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "user_program_enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_planId_fkey" FOREIGN KEY ("planId") REFERENCES "pricing_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_videos" ADD CONSTRAINT "certification_videos_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gdpr_data_requests" ADD CONSTRAINT "gdpr_data_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
