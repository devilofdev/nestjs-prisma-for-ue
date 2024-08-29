-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Avatartype" AS ENUM ('DEFAULT_MAN', 'DEFAULT_WOMAN');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "login_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "lastlogin" TIMESTAMP(3),
    "avatar_type" "Avatartype" NOT NULL DEFAULT 'DEFAULT_MAN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_ranking" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "total_game" INTEGER NOT NULL DEFAULT 0,
    "total_win" INTEGER NOT NULL DEFAULT 0,
    "win_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "player_ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "max_player_count" INTEGER NOT NULL DEFAULT 0,
    "start_player_count" INTEGER NOT NULL DEFAULT 0,
    "max_round" INTEGER NOT NULL DEFAULT 1,
    "status" "GameStatus" NOT NULL DEFAULT 'WAITING',
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "host_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamemode" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "gamemode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games_gamemode_link" (
    "games_id" INTEGER NOT NULL,
    "game_mode_id" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "round_winner_id" INTEGER,
    "is_final_round" BOOLEAN NOT NULL DEFAULT false,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_gamemode_link_pkey" PRIMARY KEY ("games_id","game_mode_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_login_id_key" ON "user"("login_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "player_ranking_user_id_key" ON "player_ranking"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "gamemode_name_key" ON "gamemode"("name");

-- AddForeignKey
ALTER TABLE "player_ranking" ADD CONSTRAINT "player_ranking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_gamemode_link" ADD CONSTRAINT "games_gamemode_link_games_id_fkey" FOREIGN KEY ("games_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_gamemode_link" ADD CONSTRAINT "games_gamemode_link_game_mode_id_fkey" FOREIGN KEY ("game_mode_id") REFERENCES "gamemode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_gamemode_link" ADD CONSTRAINT "games_gamemode_link_round_winner_id_fkey" FOREIGN KEY ("round_winner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
