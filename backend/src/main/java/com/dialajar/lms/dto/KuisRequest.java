package com.dialajar.lms.dto;

import java.util.List;

public class KuisRequest {
    private Long courseId;
    private String judul;
    private String deskripsi;
    private String deadline;
    private Integer durasiMenit;
    private List<SoalRequest> soalList;

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getJudul() { return judul; }
    public void setJudul(String judul) { this.judul = judul; }
    public String getDeskripsi() { return deskripsi; }
    public void setDeskripsi(String deskripsi) { this.deskripsi = deskripsi; }
    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
    public Integer getDurasiMenit() { return durasiMenit; }
    public void setDurasiMenit(Integer durasiMenit) { this.durasiMenit = durasiMenit; }
    public List<SoalRequest> getSoalList() { return soalList; }
    public void setSoalList(List<SoalRequest> soalList) { this.soalList = soalList; }
}
