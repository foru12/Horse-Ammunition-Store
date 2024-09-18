package org.example

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import com.mysql.cj.jdbc.MysqlDataSource

/*
object DatabaseFactory {

    const val DATABASE_URL = "jdbc:mysql://localhost:3306/"

    fun init() {
        val dataSource = MysqlDataSource().apply {
            setURL("jdbc:mysql://localhost:3306/equestrian_shop")  // Название базы данных
            user = "root"  // Имя пользователя MySQL (например, root)
            password = "root"  // Пароль для MySQL
        }

        // Подключение к базе данных
        Database.connect(dataSource)

        // Создание таблиц при старте приложения (если они не существуют)
        transaction {
            SchemaUtils.create(Products)  // Пример таблицы
        }
    }
}*/
