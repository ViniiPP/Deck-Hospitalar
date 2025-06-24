package br.login.api.apilogin.entitys;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;



@Entity
@Table(name = "sensores")
public class SensorEntity {

    @Id
    private String uuid;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private UsuarioEntity user;

    @Column(length = 100)
    private String emailVinculado;

    @Column(length = 100)
    private String nomePlaca;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getNomePlaca() {
        return nomePlaca;
    }

    public void setNomePlaca(String nomePlaca) {
        this.nomePlaca = nomePlaca;
    }


    public UsuarioEntity getUser() {
        return user;
    }

    public void setUser(UsuarioEntity user) {
        this.user = user;
    }

    public String getEmailVinculado() {
        return emailVinculado;
    }

    public void setEmailVinculado(String emailVinculado) {
        this.emailVinculado = emailVinculado;
    }



}
