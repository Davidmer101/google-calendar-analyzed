import sqlite3 from 'sqlite3'
const db = new sqlite3.Database('./database.sqlite')

db.serialize (function() {
    db.run('DROP TABLE IF EXISTS Weeks')
    db.run('CREATE TABLE IF NOT EXISTS `Weeks` ( ' +
    '`id` TEXT NOT NULL, ' +
    '`cal1` INTEGER ,  ' +
    ' `cal2` INTEGER , ' +
    ' `cal3` INTEGER , ' +
    ' `cal4` INTEGER , ' +
    ' `cal5` INTEGER , ' +
    ' `username` TEXT NOT NULL, ' +
    ' PRIMARY KEY (`id`, `username`) )' );

    db.run('DROP TABLE IF EXISTS users')
    db.run('CREATE TABLE IF NOT EXISTS `Users` ( ' +
    '`id` INTEGER, ' +
    '`username` TEXT UNIQUE,  ' +
    ' `password` TEXT NOT NULL, ' +
    ' `email` TEXT, ' +
    ' PRIMARY KEY (`id`) )' );
    
    
});
