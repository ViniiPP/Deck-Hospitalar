package br.login.api.apilogin.entitys;



public class DadosEntity {

    private String qualidadeDoAr;
    private String ruido;
    private String umidade;
    private String Temperatura;
    private String Luminosidade;

    public DadosEntity(String qualidadeDoAr, String ruido, String umidade, String Temperatura, String Luminosidade) {
        this.qualidadeDoAr = qualidadeDoAr;
        this.ruido = ruido;
        this.umidade = umidade;
        this.Temperatura = Temperatura;
        this.Luminosidade = Luminosidade;

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
