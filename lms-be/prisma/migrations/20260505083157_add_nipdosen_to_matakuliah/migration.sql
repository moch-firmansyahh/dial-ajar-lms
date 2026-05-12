-- DropForeignKey
ALTER TABLE "ForumDiskusi" DROP CONSTRAINT "ForumDiskusi_idMataKuliah_fkey";

-- DropForeignKey
ALTER TABLE "ForumDiskusi" DROP CONSTRAINT "ForumDiskusi_nomorInduk_fkey";

-- DropForeignKey
ALTER TABLE "Kelompok" DROP CONSTRAINT "Kelompok_idMataKuliah_fkey";

-- DropForeignKey
ALTER TABLE "KomentarForum" DROP CONSTRAINT "KomentarForum_idForum_fkey";

-- DropForeignKey
ALTER TABLE "KomentarForum" DROP CONSTRAINT "KomentarForum_nomorInduk_fkey";

-- DropForeignKey
ALTER TABLE "Kuis" DROP CONSTRAINT "Kuis_idMataKuliah_fkey";

-- DropForeignKey
ALTER TABLE "LikeForum" DROP CONSTRAINT "LikeForum_idForum_fkey";

-- DropForeignKey
ALTER TABLE "LikeForum" DROP CONSTRAINT "LikeForum_nomorInduk_fkey";

-- DropForeignKey
ALTER TABLE "ModulAjar" DROP CONSTRAINT "ModulAjar_idMataKuliah_fkey";

-- DropForeignKey
ALTER TABLE "Nilai" DROP CONSTRAINT "Nilai_idMataKuliah_fkey";

-- DropForeignKey
ALTER TABLE "Nilai" DROP CONSTRAINT "Nilai_nomorInduk_fkey";

-- DropForeignKey
ALTER TABLE "PengumpulanTugas" DROP CONSTRAINT "PengumpulanTugas_idKelompok_fkey";

-- DropForeignKey
ALTER TABLE "PengumpulanTugas" DROP CONSTRAINT "PengumpulanTugas_idTugas_fkey";

-- DropForeignKey
ALTER TABLE "PengumpulanTugas" DROP CONSTRAINT "PengumpulanTugas_nim_fkey";

-- DropForeignKey
ALTER TABLE "PilihanJawaban" DROP CONSTRAINT "PilihanJawaban_idSoal_fkey";

-- DropForeignKey
ALTER TABLE "Presensi" DROP CONSTRAINT "Presensi_idMataKuliah_fkey";

-- DropForeignKey
ALTER TABLE "Presensi" DROP CONSTRAINT "Presensi_nim_fkey";

-- DropForeignKey
ALTER TABLE "ProgressTugas" DROP CONSTRAINT "ProgressTugas_idMataKuliah_fkey";

-- DropForeignKey
ALTER TABLE "ProgressTugas" DROP CONSTRAINT "ProgressTugas_nim_fkey";

-- DropForeignKey
ALTER TABLE "Soal" DROP CONSTRAINT "Soal_idKuis_fkey";

-- DropForeignKey
ALTER TABLE "Tugas" DROP CONSTRAINT "Tugas_idMataKuliah_fkey";

-- DropForeignKey
ALTER TABLE "Tugas" DROP CONSTRAINT "Tugas_nim_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- AlterTable
ALTER TABLE "MataKuliah" ADD COLUMN     "nipDosen" VARCHAR(20);

-- AlterTable
ALTER TABLE "PengumpulanTugas" ALTER COLUMN "idKelompok" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MataKuliah" ADD CONSTRAINT "MataKuliah_nipDosen_fkey" FOREIGN KEY ("nipDosen") REFERENCES "Dosen"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_nomorInduk_fkey" FOREIGN KEY ("nomorInduk") REFERENCES "User"("nomorInduk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_idMataKuliah_fkey" FOREIGN KEY ("idMataKuliah") REFERENCES "MataKuliah"("idMataKuliah") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kuis" ADD CONSTRAINT "Kuis_idMataKuliah_fkey" FOREIGN KEY ("idMataKuliah") REFERENCES "MataKuliah"("idMataKuliah") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soal" ADD CONSTRAINT "Soal_idKuis_fkey" FOREIGN KEY ("idKuis") REFERENCES "Kuis"("idKuis") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilihanJawaban" ADD CONSTRAINT "PilihanJawaban_idSoal_fkey" FOREIGN KEY ("idSoal") REFERENCES "Soal"("idSoal") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumDiskusi" ADD CONSTRAINT "ForumDiskusi_idMataKuliah_fkey" FOREIGN KEY ("idMataKuliah") REFERENCES "MataKuliah"("idMataKuliah") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumDiskusi" ADD CONSTRAINT "ForumDiskusi_nomorInduk_fkey" FOREIGN KEY ("nomorInduk") REFERENCES "User"("nomorInduk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KomentarForum" ADD CONSTRAINT "KomentarForum_nomorInduk_fkey" FOREIGN KEY ("nomorInduk") REFERENCES "User"("nomorInduk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KomentarForum" ADD CONSTRAINT "KomentarForum_idForum_fkey" FOREIGN KEY ("idForum") REFERENCES "ForumDiskusi"("idForumDiskusi") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeForum" ADD CONSTRAINT "LikeForum_nomorInduk_fkey" FOREIGN KEY ("nomorInduk") REFERENCES "User"("nomorInduk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeForum" ADD CONSTRAINT "LikeForum_idForum_fkey" FOREIGN KEY ("idForum") REFERENCES "ForumDiskusi"("idForumDiskusi") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulAjar" ADD CONSTRAINT "ModulAjar_idMataKuliah_fkey" FOREIGN KEY ("idMataKuliah") REFERENCES "MataKuliah"("idMataKuliah") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelompok" ADD CONSTRAINT "Kelompok_idMataKuliah_fkey" FOREIGN KEY ("idMataKuliah") REFERENCES "MataKuliah"("idMataKuliah") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tugas" ADD CONSTRAINT "Tugas_idMataKuliah_fkey" FOREIGN KEY ("idMataKuliah") REFERENCES "MataKuliah"("idMataKuliah") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tugas" ADD CONSTRAINT "Tugas_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_idMataKuliah_fkey" FOREIGN KEY ("idMataKuliah") REFERENCES "MataKuliah"("idMataKuliah") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressTugas" ADD CONSTRAINT "ProgressTugas_idMataKuliah_fkey" FOREIGN KEY ("idMataKuliah") REFERENCES "MataKuliah"("idMataKuliah") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressTugas" ADD CONSTRAINT "ProgressTugas_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengumpulanTugas" ADD CONSTRAINT "PengumpulanTugas_idKelompok_fkey" FOREIGN KEY ("idKelompok") REFERENCES "Kelompok"("idKelompok") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengumpulanTugas" ADD CONSTRAINT "PengumpulanTugas_idTugas_fkey" FOREIGN KEY ("idTugas") REFERENCES "Tugas"("idTugas") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengumpulanTugas" ADD CONSTRAINT "PengumpulanTugas_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE CASCADE ON UPDATE CASCADE;
