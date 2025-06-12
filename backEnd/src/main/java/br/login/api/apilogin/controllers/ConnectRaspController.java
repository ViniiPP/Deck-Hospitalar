package br.login.api.apilogin.controllers;


import br.login.api.apilogin.DTOS.IdDTO;
import br.login.api.apilogin.services.RaspService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("ws/uuid")
public class ConnectRaspController {

    private final RaspService raspService;

    public ConnectRaspController(RaspService raspService) {
        this.raspService = raspService;
    }


    @PostMapping()
    public ResponseEntity<String> connectRasp(@RequestBody IdDTO id) throws Exception {
       try {
           raspService.saveNewSensor(id);
           return ResponseEntity.ok().body("Vinculado com sucesso");
       }catch (Exception e) {
           throw new Exception("Erro no salvar, tente novamente\n" + e.getMessage() );
       }
    }
}
