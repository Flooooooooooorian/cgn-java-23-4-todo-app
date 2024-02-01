package de.neuefische.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void testgetCurrentUser_whenNotLoggedIn_ReturnAnonymousUser() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("anonymousUser"));
    }

    @Test
        //@WithMockUser
    void testgetCurrentUser_whenLoggedIn_ReturnUserName() throws Exception {
        //userRepo.save(new AppUser("123", "github-user"));

        mockMvc.perform(get("/api/users/me")
                        .with(oidcLogin()
                                .userInfoToken(token -> token.claim("login", "github-user"))))
                .andExpect(status().isOk())
                .andExpect(content().string("github-user"));
    }
}
