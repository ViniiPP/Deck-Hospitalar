package br.login.api.apilogin.DTOS;

public class IdDTO {
    public String getUuid() {
        return uuid;
    }

    @Override
    public String toString() {
        return super.toString();
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String uuid;
}
