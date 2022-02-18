-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "user_name" TEXT,
    "email" TEXT,
    "activated" BOOLEAN DEFAULT false,
    "state" BOOLEAN DEFAULT false,
    "avatar_url" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_user_name_key" ON "Users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
