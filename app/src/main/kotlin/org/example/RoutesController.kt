package org.example

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.principal
import io.ktor.server.request.receive
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.example.Categories
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt



fun Route.categoryRoutes() {
    route("/categories") {
        get {
            val categories = transaction {
                Categories.selectAll().map {
                    Category(it[Categories.id], it[Categories.name])
                }
            }
            call.respond(categories)
        }

        post("/create") {
            val category = call.receive<Category>()
            transaction {
                Categories.insert {
                    it[name] = category.name
                }
            }
            call.respond(HttpStatusCode.Created, "Category created successfully")
        }

        delete("/delete/{id}") {
            val categoryId = call.parameters["id"]?.toIntOrNull()
            if (categoryId != null) {
                transaction {
                    Categories.deleteWhere { Categories.id eq categoryId }
                }
                call.respond(HttpStatusCode.OK, "Category deleted successfully")
            } else {
                call.respond(HttpStatusCode.BadRequest, "Invalid category ID")
            }
        }
    }
}


fun Route.productRoutes() {
    route("/products") {
        get {
            val products = transaction {
                Products.selectAll().map {
                    Product(
                        id = it[Products.id],
                        name = it[Products.name],
                        description = it[Products.description],
                        price = it[Products.price],
                        imageUrl = it[Products.imageUrl],
                        category = it[Products.category]
                    )
                }
            }
            call.respond(products)
        }

        post("/add") {
            val product = call.receive<Product>()
            transaction {
                Products.insert {
                    it[name] = product.name
                    it[description] = product.description
                    it[price] = product.price
                    it[imageUrl] = product.imageUrl
                    it[category] = product.category // Назначаем EntityID категории
                }
            }
            call.respond(HttpStatusCode.Created, "Product added successfully")
        }

        delete("/delete/{id}") {
            val productId = call.parameters["id"]?.toIntOrNull()
            if (productId != null) {
                transaction {
                    Products.deleteWhere { Products.id eq productId }
                }
                call.respond(HttpStatusCode.OK, "Product deleted successfully")
            } else {
                call.respond(HttpStatusCode.BadRequest, "Invalid product ID")
            }
        }
    }
}

// Маршрут для регистрации
fun Route.registerRoute() {
    post("/register") {
        val registrationData = call.receive<UserRegistration>()
        val hashedPassword = BCrypt.hashpw(registrationData.password, BCrypt.gensalt())

        transaction {
            Users.insert {
                it[username] = registrationData.username
                it[email] = registrationData.email
                it[password] = hashedPassword
            }
        }
        call.respond(HttpStatusCode.Created, "User registered successfully")
    }
}

// Маршрут для авторизации
fun Route.loginRoute() {
    post("/login") {
        val loginData = call.receive<UserLogin>()
        val user = transaction {
            Users.select { Users.username eq loginData.username }
                .map {
                    it[Users.password] to it[Users.username]
                }.singleOrNull()
        }

        if (user != null && BCrypt.checkpw(loginData.password, user.first)) {
            // Если пользователь авторизован, генерируем токен
            val token = JWT.create()
                .withAudience("ktor-audience")
                .withIssuer("ktor-issuer")
                .withClaim("username", user.second)
                .sign(Algorithm.HMAC256("secret"))

            // Отправляем токен в ответе
            call.respond(hashMapOf("token" to token))

            // Перенаправление после успешного входа
            if (loginData.username == "admin") {
                call.respondRedirect("/admin")  // Перенаправление в админку
            } else {
                call.respondRedirect("/index")  // Перенаправление на главную
            }
        } else {
            call.respond(HttpStatusCode.Unauthorized, "Invalid username or password")
        }
    }

    get("/admin") {
        call.respondText("Добро пожаловать в админ-панель, ${call.principal<JWTPrincipal>()?.getClaim("username", String::class)}!")
    }
}

// Защищенные маршруты
fun Route.protectedRoute() {
    authenticate("auth-jwt") {
        get("/protected") {
            val principal = call.principal<JWTPrincipal>()
            val username = principal?.getClaim("username", String::class)
            call.respondText("Hello, $username!")
        }
    }
}
