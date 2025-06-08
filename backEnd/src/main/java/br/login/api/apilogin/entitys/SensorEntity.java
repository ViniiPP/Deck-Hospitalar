package br.login.api.apilogin.entitys;


import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "sensores")
public class SensorEntity extends GenericEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UsuarioEntity user;

    @Column (length = 20)
    private Double temperatura;

    @Column (length = 20)
    private Double umidade;

    @Column (length = 20)
    private Double luminosidade;

    @Column (length = 20)
    private Double ruido;


    public UsuarioEntity getUser() {
        return user;
    }

    public void setUser(UsuarioEntity user) {
        this.user = user;
    }

    public Double getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(Double temperatura) {
        this.temperatura = temperatura;
    }

    public Double getUmidade() {
        return umidade;
    }

    public void setUmidade(Double umidade) {
        this.umidade = umidade;
    }

    public Double getLuminosidade() {
        return luminosidade;
    }

    public void setLuminosidade(Double luminosidade) {
        this.luminosidade = luminosidade;
    }

    public Double getRuido() {
        return ruido;
    }

    public void setRuido(Double ruido) {
        this.ruido = ruido;
    }


}
