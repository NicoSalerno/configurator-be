-- ==============================================
-- CREAZIONE DATABASE
-- ==============================================
CREATE DATABASE IF NOT EXISTS MaseratiDB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE MaseratiDB;

-- ==============================================
-- TABELLA MODELLI
-- ==============================================
CREATE TABLE TModelli (
    ModelloID INT NOT NULL AUTO_INCREMENT,
    Nome VARCHAR(50) NOT NULL,
    PrezzoBase DOUBLE NOT NULL,
    FileImageSfondo VARCHAR(255) NOT NULL,
    PRIMARY KEY (ModelloID)
);

-- ==============================================
-- TABELLA CATEGORIE OPTIONAL
-- ==============================================
CREATE TABLE TCategorieOptional (
    CategoriaOptionalID INT NOT NULL AUTO_INCREMENT,
    Nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (CategoriaOptionalID)
);

-- ==============================================
-- TABELLA OPTIONAL
-- ==============================================
CREATE TABLE TOptional (
    OptionalID INT NOT NULL AUTO_INCREMENT,
    ModelloID INT NOT NULL,
    CategoriaOptionalID INT NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Prezzo DOUBLE NOT NULL,
    FileImage VARCHAR(255) NOT NULL,
    Predefinito BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (OptionalID),
    FOREIGN KEY (ModelloID) REFERENCES TModelli(ModelloID),
    FOREIGN KEY (CategoriaOptionalID) REFERENCES TCategorieOptional(CategoriaOptionalID)
);

-- ==============================================
-- INSERIMENTO MODELLI
-- ==============================================
INSERT INTO TModelli (Nome, PrezzoBase, FileImageSfondo)
VALUES 
('GranCabrio', 130000, 'sfondo_grancabrio.png'),
('GranTurismo', 150000, 'sfondo_granturismo.png');

-- ==============================================
-- INSERIMENTO CATEGORIE OPTIONAL
-- ==============================================
INSERT INTO TCategorieOptional (Nome)
VALUES
('Colore Carrozzeria'),
('Tipo Cerchi'),
('Tipo Pinze'),
('Colore Capote');

-- ==============================================
-- INSERIMENTO OPTIONAL
-- ==============================================
INSERT INTO TOptional (ModelloID, CategoriaOptionalID, Nome, Prezzo, FileImage, Predefinito)
VALUES
-- ==== Modello 1: GranCabrio ====
(1, 1, 'Bianco eldorado', 1500, 'carrozzeria_bianco_eldorado.png', 1),
(1, 1, 'Blu oceano', 1800, 'carrozzeria_blu_oceano.png', 0),
(1, 1, 'Grigio touring', 2200, 'carrozzeria_grigio_touring.png', 0),
(1, 1, 'Nero', 2800, 'carrozzeria_nero.png', 0),
(1, 1, 'Rosso trionfale', 3300, 'carrozzeria_rosso_trionfale.png', 0),

(1, 2, 'Birdcage grigio mercury', 1500, 'cerchi_20_birdcage_grigio_mercury.png', 1),
(1, 2, 'Birdcage', 1600, 'cerchi_20_birdcage.png', 0),
(1, 2, 'Neptune grigio mercury', 1700, 'cerchi_20_neptune_grigio_mercury.png', 0),
(1, 2, 'Neptune', 1800, 'cerchi_20_neptune.png', 0),
(1, 2, 'Trident grigio mercury', 1500, 'cerchi_20_trident_grigio_mercury.png', 0),
(1, 2, 'Trident', 1700, 'cerchi_20_trident.png', 0),

(1, 3, 'Argento', 300, 'pinze_argento.png', 1),
(1, 3, 'Blu opaco anodizzato', 350, 'pinze_blu_opaco_anodizzato.png', 0),
(1, 3, 'Blu', 280, 'pinze_blu.png', 0),
(1, 3, 'Gialle', 320, 'pinze_gialle.png', 0),
(1, 3, 'Nere', 350, 'pinze_nere.png', 0),
(1, 3, 'Rosse', 380, 'pinze_rosse.png', 0),
(1, 3, 'Titanio', 350, 'pinze_titanio.png', 0),
(1, 3, 'Rosso opaco anodizzato', 350, 'pinze_rosso_opaco_anodizzato.png', 0),

(1, 4, 'Blu', 2500, 'capote_blu.png', 0),
(1, 4, 'Burgundi', 2800, 'capote_burgundi.png', 0),
(1, 4, 'Cioccolato', 2500, 'capote_cioccolato.png', 1),
(1, 4, 'Grigio Titanio', 2800, 'capote_grigio_titanio.png', 0),
(1, 4, 'Java', 2900, 'capote_java.png', 0),

-- ==== Modello 2: GranTurismo ====
(2, 1, 'Blu passione', 1600, 'carrozzeria_blu_passione.png', 1),
(2, 1, 'Nero ribelle', 1800, 'carrozzeria_nero_ribelle.png', 0),
(2, 1, 'Rosso folgore', 2100, 'carrozzeria_rosso_folgore.png', 0),

(2, 2, 'Cerchi Mercurio', 1900, 'cerchi_mercurio.png', 1),
(2, 2, 'Cerchi Plutone', 1800, 'cerchi_plutone.png', 0),
(2, 2, 'Cerchi Urano', 1700, 'cerchi_urano.png', 0);
