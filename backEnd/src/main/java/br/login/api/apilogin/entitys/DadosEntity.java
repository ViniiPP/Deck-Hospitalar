package br.login.api.apilogin.entitys;



public class DadosEntity {


    private String uuid;
    private String qualidadeDoAr;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    private String ruido;
    private String umidade;
    private String Temperatura;
    private String Luminosidade;

    public DadosEntity(String qualidadeDoAr, String ruido, String umidade, String Temperatura, String Luminosidade,String uuid) {
        this.qualidadeDoAr = qualidadeDoAr;
        this.ruido = ruido;
        this.umidade = umidade;
        this.Temperatura = Temperatura;
        this.Luminosidade = Luminosidade;
        this.uuid = uuid;

    }

    @Override
    public String toString() {
        return "DadosEntity{" +
                "uuid='" + uuid + '\'' +
                ", qualidadeDoAr='" + qualidadeDoAr + '\'' +
                ", ruido='" + ruido + '\'' +
                ", umidade='" + umidade + '\'' +
                ", Temperatura='" + Temperatura + '\'' +
                ", Luminosidade='" + Luminosidade + '\'' +
                '}';
    }

    public String getQualidadeDoAr() {
        return qualidadeDoAr;
    }

    public void setQualidadeDoAr(String qualidadeDoAr) {
        this.qualidadeDoAr = qualidadeDoAr;
    }

    public String getRuido() {
        return ruido;
    }

    public void setRuido(String ruido) {
        this.ruido = ruido;
    }

    public String getUmidade() {
        return umidade;
    }

    public void setUmidade(String umidade) {
        this.umidade = umidade;
    }

    public String getTemperatura() {
        return Temperatura;
    }

    public void setTemperatura(String temperatura) {
        Temperatura = temperatura;
    }

    public String getLuminosidade() {
        return Luminosidade;
    }

    public void setLuminosidade(String luminosidade) {
        Luminosidade = luminosidade;
    }
}
