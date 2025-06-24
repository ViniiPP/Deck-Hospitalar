package br.login.api.apilogin.services;


import br.login.api.apilogin.DTOS.IdDTO;
import br.login.api.apilogin.Utils.ExtractEmail;
import br.login.api.apilogin.entitys.SensorEntity;
import br.login.api.apilogin.entitys.UsuarioEntity;
import br.login.api.apilogin.repositorys.SensorRepository;
import br.login.api.apilogin.repositorys.UsuarioRepository;

import org.springframework.stereotype.Service;



@Service
public class RaspService {

    private final UsuarioRepository userRepository;
    private final SensorRepository sensorRepository;

    public RaspService(UsuarioRepository userRepository, SensorRepository sensorRepository) {
        this.userRepository = userRepository;
        this.sensorRepository = sensorRepository;
    }

    public void saveNewSensor(IdDTO novoUuid) throws Exception {
        UsuarioEntity usuario = userRepository.findByEmail(ExtractEmail.extrairEmail())
                .orElseThrow(() -> new Exception("Usuário não encontrado"));

        SensorEntity sensor = new SensorEntity();
        sensor.setUuid(novoUuid.getUuid());
        sensor.setNomePlaca(novoUuid.toString());
        sensor.setUser(usuario);
        sensor.setEmailVinculado(usuario.getEmail());

        sensorRepository.save(sensor);
    }

    public void alterSensorName(String uuid, String name) throws Exception {
        sensorRepository.findById(uuid).ifPresent(sensor -> {
            sensor.setNomePlaca(name);
            sensorRepository.save(sensor);
        });
    }
}
