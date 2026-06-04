package com.dialajar.lms.dto.request;

public class CourseJoinRequest {
    private String kodeKelas;
    private Long mahasiswaId;

    // Getters and Setters
    public String getKodeKelas() { return kodeKelas; }
    public void setKodeKelas(String kodeKelas) { this.kodeKelas = kodeKelas; }
    public Long getMahasiswaId() { return mahasiswaId; }
    public void setMahasiswaId(Long mahasiswaId) { this.mahasiswaId = mahasiswaId; }
}
