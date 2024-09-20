package org.example.data
import org.jetbrains.exposed.sql.*

object Users : Table("users") {
    val id = integer("id").autoIncrement().autoIncrement()
    val username = varchar("username", 255).uniqueIndex()
    val email = varchar("email", 255).uniqueIndex()
    val password = varchar("password", 255)  // Здесь будем хранить хешированный пароль
}
