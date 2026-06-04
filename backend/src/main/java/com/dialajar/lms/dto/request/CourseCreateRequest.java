package com.dialajar.lms.dto.request;

public class CourseCreateRequest {
    private String nama;
    private String kodeKelas;
    private Long dosenId;

    // Getters and Setters
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    public String getKodeKelas() { return kodeKelas; }
    public void setKodeKelas(String kodeKelas) { this.kodeKelas = kodeKelas; }
    public Long getDosenId() { return dosenId; }
    public void setDosenId(Long dosenId) { this.dosenId = dosenId; }
}
