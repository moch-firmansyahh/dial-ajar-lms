-- AlterTable
ALTER TABLE "MataKuliah" ADD COLUMN     "semester" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "sks" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "waktu" VARCHAR(100);

-- AlterTable
ALTER TABLE "Presensi" ADD COLUMN     "waktuPresensi" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Tugas" ADD COLUMN     "fileTugas" VARCHAR(255),
ADD COLUMN     "namaFileTugas" VARCHAR(255),
ADD COLUMN     "tipeFileTugas" VARCHAR(50),
ADD COLUMN     "tipeTugas" VARCHAR(20) NOT NULL DEFAULT 'Individu',
ADD COLUMN     "ukuranFile" VARCHAR(50);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fotoUrl" VARCHAR(500);

-- CreateTable
CREATE TABLE "JawabanKuis" (
    "idJawabanKuis" SERIAL NOT NULL,
    "idKuis" INTEGER NOT NULL,
    "nim" VARCHAR(20) NOT NULL,
    "skor" INTEGER,
    "jawaban" TEXT,
    "tanggalKerja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JawabanKuis_pkey" PRIMARY KEY ("idJawabanKuis")
);

-- CreateTable
CREATE TABLE "ProgressMateri" (
    "idProgress" SERIAL NOT NULL,
    "idModulAjar" INTEGER NOT NULL,
    "nim" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'belum',
    "tanggalAkses" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressMateri_pkey" PRIMARY KEY ("idProgress")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "idNotifikasi" SERIAL NOT NULL,
    "nim" VARCHAR(20) NOT NULL,
    "judul" VARCHAR(200) NOT NULL,
    "pesan" TEXT,
    "tipe" VARCHAR(50) NOT NULL DEFAULT 'info',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idRef" INTEGER,
    "tipeRef" VARCHAR(50),

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("idNotifikasi")
);

-- CreateIndex
CREATE UNIQUE INDEX "JawabanKuis_idKuis_nim_key" ON "JawabanKuis"("idKuis", "nim");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressMateri_idModulAjar_nim_key" ON "ProgressMateri"("idModulAjar", "nim");

-- AddForeignKey
ALTER TABLE "JawabanKuis" ADD CONSTRAINT "JawabanKuis_idKuis_fkey" FOREIGN KEY ("idKuis") REFERENCES "Kuis"("idKuis") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JawabanKuis" ADD CONSTRAINT "JawabanKuis_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressMateri" ADD CONSTRAINT "ProgressMateri_idModulAjar_fkey" FOREIGN KEY ("idModulAjar") REFERENCES "ModulAjar"("idModulAjar") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressMateri" ADD CONSTRAINT "ProgressMateri_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE CASCADE ON UPDATE CASCADE;
