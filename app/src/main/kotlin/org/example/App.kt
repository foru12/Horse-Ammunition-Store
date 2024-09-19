/*
 * This source file was generated by the Gradle 'init' task
 */
package org.example

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.http.*
import io.ktor.serialization.gson.*
import io.ktor.server.application.*
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update



fun main() {
    embeddedServer(Netty, port = 8081) {
        module()
    }.start(wait = true)
}

fun Application.module() {
    Database.connect(
        url = "jdbc:mysql://127.0.0.1:3306/hors_shop",
        driver = "com.mysql.cj.jdbc.Driver",
        user = "root",
        password = "root"
    )

    // Остальные установки CORS, ContentNegotiation и маршруты
    install(CORS) {
        anyHost()
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Delete)
        allowHeader("Content-Type")
    }
    install(Authentication) {
        jwt("auth-jwt") {
            realm = "ktor sample app"
            verifier(JWT
                .require(Algorithm.HMAC256("secret"))
                .withAudience("ktor-audience")
                .withIssuer("ktor-issuer")
                .build())
            validate { credential ->
                if (credential.payload.audience.contains("ktor-audience")) JWTPrincipal(credential.payload) else null
            }
            challenge { _, _ ->
                call.respond(HttpStatusCode.Unauthorized, "Token is not valid or has expired")
            }
        }
    }

    install(ContentNegotiation) {
        gson {
            setPrettyPrinting()
        }
    }

    routing {
        productRoutes()
        registerRoute()
        loginRoute()
        protectedRoute()
    }
}

