--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3
-- Dumped by pg_dump version 10.3

-- Started on 2018-05-31 19:31:25 CST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 13241)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3306 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 232 (class 1259 OID 62903)
-- Name: counters; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.counters (
    id integer NOT NULL,
    gw_id character varying(255),
    gw_sn character varying(255),
    ip character varying(255),
    mac character varying(255),
    token character varying(255),
    incoming bigint,
    outgoing bigint,
    usedtime integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.counters OWNER TO tibetwifi;

--
-- TOC entry 231 (class 1259 OID 62901)
-- Name: counters_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.counters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.counters_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3307 (class 0 OID 0)
-- Dependencies: 231
-- Name: counters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.counters_id_seq OWNED BY public.counters.id;


--
-- TOC entry 236 (class 1259 OID 63000)
-- Name: films; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.films (
    id integer NOT NULL,
    pos character varying(255),
    name character varying(255),
    imgh character varying(255),
    imgv character varying(255),
    director character varying(255),
    tostar character varying(255),
    score double precision,
    price double precision,
    description character varying(255),
    httpurl character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    filmtype_id integer
);


ALTER TABLE public.films OWNER TO tibetwifi;

--
-- TOC entry 235 (class 1259 OID 62998)
-- Name: films_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.films_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.films_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3308 (class 0 OID 0)
-- Dependencies: 235
-- Name: films_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.films_id_seq OWNED BY public.films.id;


--
-- TOC entry 234 (class 1259 OID 62992)
-- Name: filmtypes; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.filmtypes (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.filmtypes OWNER TO tibetwifi;

--
-- TOC entry 233 (class 1259 OID 62990)
-- Name: filmtypes_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.filmtypes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.filmtypes_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3309 (class 0 OID 0)
-- Dependencies: 233
-- Name: filmtypes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.filmtypes_id_seq OWNED BY public.filmtypes.id;


--
-- TOC entry 240 (class 1259 OID 63024)
-- Name: games; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.games (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255),
    imgsmall character varying(255),
    imgbig character varying(255),
    httpurl character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    gametype_id integer
);


ALTER TABLE public.games OWNER TO tibetwifi;

--
-- TOC entry 239 (class 1259 OID 63022)
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.games_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3310 (class 0 OID 0)
-- Dependencies: 239
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- TOC entry 238 (class 1259 OID 63016)
-- Name: gametypes; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.gametypes (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.gametypes OWNER TO tibetwifi;

--
-- TOC entry 237 (class 1259 OID 63014)
-- Name: gametypes_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.gametypes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gametypes_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3311 (class 0 OID 0)
-- Dependencies: 237
-- Name: gametypes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.gametypes_id_seq OWNED BY public.gametypes.id;


--
-- TOC entry 223 (class 1259 OID 62845)
-- Name: mtfis; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.mtfis (
    id integer NOT NULL,
    gw_id character varying(255),
    gw_sn character varying(255),
    gw_address character varying(255),
    gw_port character varying(255),
    ssid character varying(255),
    apmac character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.mtfis OWNER TO tibetwifi;

--
-- TOC entry 222 (class 1259 OID 62843)
-- Name: mtfis_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.mtfis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mtfis_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3312 (class 0 OID 0)
-- Dependencies: 222
-- Name: mtfis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.mtfis_id_seq OWNED BY public.mtfis.id;


--
-- TOC entry 248 (class 1259 OID 63095)
-- Name: myfilms; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.myfilms (
    id integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    film_id integer,
    purchasetype character varying(255)
);


ALTER TABLE public.myfilms OWNER TO tibetwifi;

--
-- TOC entry 247 (class 1259 OID 63093)
-- Name: myfilms_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.myfilms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.myfilms_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3313 (class 0 OID 0)
-- Dependencies: 247
-- Name: myfilms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.myfilms_id_seq OWNED BY public.myfilms.id;


--
-- TOC entry 246 (class 1259 OID 63082)
-- Name: mynovels; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.mynovels (
    id integer NOT NULL,
    progress integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    nove_id integer,
    purchasetype character varying(255)
);


ALTER TABLE public.mynovels OWNER TO tibetwifi;

--
-- TOC entry 245 (class 1259 OID 63080)
-- Name: mynovels_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.mynovels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mynovels_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3314 (class 0 OID 0)
-- Dependencies: 245
-- Name: mynovels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.mynovels_id_seq OWNED BY public.mynovels.id;


--
-- TOC entry 225 (class 1259 OID 62858)
-- Name: news; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying(255),
    description character varying(255),
    img_1 character varying(255),
    img_2 character varying(255),
    img_3 character varying(255),
    content text,
    httpurl character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    type character varying(255)
);


ALTER TABLE public.news OWNER TO tibetwifi;

--
-- TOC entry 224 (class 1259 OID 62856)
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.news_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3315 (class 0 OID 0)
-- Dependencies: 224
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- TOC entry 244 (class 1259 OID 63048)
-- Name: novels; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.novels (
    id integer NOT NULL,
    name character varying(255),
    author character varying(255),
    img character varying(255),
    price double precision,
    description character varying(255),
    httpurl character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    noveltype_id integer
);


ALTER TABLE public.novels OWNER TO tibetwifi;

--
-- TOC entry 243 (class 1259 OID 63046)
-- Name: novels_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.novels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.novels_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3316 (class 0 OID 0)
-- Dependencies: 243
-- Name: novels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.novels_id_seq OWNED BY public.novels.id;


--
-- TOC entry 242 (class 1259 OID 63040)
-- Name: noveltypes; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.noveltypes (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.noveltypes OWNER TO tibetwifi;

--
-- TOC entry 241 (class 1259 OID 63038)
-- Name: noveltypes_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.noveltypes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.noveltypes_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3317 (class 0 OID 0)
-- Dependencies: 241
-- Name: noveltypes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.noveltypes_id_seq OWNED BY public.noveltypes.id;


--
-- TOC entry 227 (class 1259 OID 62869)
-- Name: orders; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    mac character varying(255),
    "from" character varying(255),
    key character varying(255),
    val bigint,
    status smallint,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.orders OWNER TO tibetwifi;

--
-- TOC entry 226 (class 1259 OID 62867)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3318 (class 0 OID 0)
-- Dependencies: 226
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 229 (class 1259 OID 62880)
-- Name: sta; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.sta (
    id integer NOT NULL,
    gw_id character varying(255),
    gw_sn character varying(255),
    ip character varying(255),
    mac character varying(255),
    username character varying(255),
    usergroup character varying(255),
    timeout integer,
    auth_deny boolean DEFAULT false,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.sta OWNER TO tibetwifi;

--
-- TOC entry 228 (class 1259 OID 62878)
-- Name: sta_id_seq; Type: SEQUENCE; Schema: public; Owner: tibetwifi
--

CREATE SEQUENCE public.sta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sta_id_seq OWNER TO tibetwifi;

--
-- TOC entry 3319 (class 0 OID 0)
-- Dependencies: 228
-- Name: sta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tibetwifi
--

ALTER SEQUENCE public.sta_id_seq OWNED BY public.sta.id;


--
-- TOC entry 230 (class 1259 OID 62892)
-- Name: tokens; Type: TABLE; Schema: public; Owner: tibetwifi
--

CREATE TABLE public.tokens (
    gw_id character varying(255),
    gw_sn character varying(255),
    ip character varying(255),
    mac character varying(255),
    auth integer,
    token uuid NOT NULL,
    username character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.tokens OWNER TO tibetwifi;

--
-- TOC entry 3103 (class 2604 OID 62906)
-- Name: counters id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.counters ALTER COLUMN id SET DEFAULT nextval('public.counters_id_seq'::regclass);


--
-- TOC entry 3105 (class 2604 OID 63003)
-- Name: films id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.films ALTER COLUMN id SET DEFAULT nextval('public.films_id_seq'::regclass);


--
-- TOC entry 3104 (class 2604 OID 62995)
-- Name: filmtypes id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.filmtypes ALTER COLUMN id SET DEFAULT nextval('public.filmtypes_id_seq'::regclass);


--
-- TOC entry 3107 (class 2604 OID 63027)
-- Name: games id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- TOC entry 3106 (class 2604 OID 63019)
-- Name: gametypes id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.gametypes ALTER COLUMN id SET DEFAULT nextval('public.gametypes_id_seq'::regclass);


--
-- TOC entry 3098 (class 2604 OID 62848)
-- Name: mtfis id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.mtfis ALTER COLUMN id SET DEFAULT nextval('public.mtfis_id_seq'::regclass);


--
-- TOC entry 3111 (class 2604 OID 63098)
-- Name: myfilms id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.myfilms ALTER COLUMN id SET DEFAULT nextval('public.myfilms_id_seq'::regclass);


--
-- TOC entry 3110 (class 2604 OID 63085)
-- Name: mynovels id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.mynovels ALTER COLUMN id SET DEFAULT nextval('public.mynovels_id_seq'::regclass);


--
-- TOC entry 3099 (class 2604 OID 62861)
-- Name: news id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- TOC entry 3109 (class 2604 OID 63051)
-- Name: novels id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.novels ALTER COLUMN id SET DEFAULT nextval('public.novels_id_seq'::regclass);


--
-- TOC entry 3108 (class 2604 OID 63043)
-- Name: noveltypes id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.noveltypes ALTER COLUMN id SET DEFAULT nextval('public.noveltypes_id_seq'::regclass);


--
-- TOC entry 3100 (class 2604 OID 62872)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 3101 (class 2604 OID 62883)
-- Name: sta id; Type: DEFAULT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.sta ALTER COLUMN id SET DEFAULT nextval('public.sta_id_seq'::regclass);


--
-- TOC entry 3282 (class 0 OID 62903)
-- Dependencies: 232
-- Data for Name: counters; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.counters (id, gw_id, gw_sn, ip, mac, token, incoming, outgoing, usedtime, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3286 (class 0 OID 63000)
-- Dependencies: 236
-- Data for Name: films; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.films (id, pos, name, imgh, imgv, director, tostar, score, price, description, httpurl, created_at, updated_at, filmtype_id) FROM stdin;
3	normal	复仇者联盟3	/public/img/1.png	/public/img/1.png	安东尼	小罗伯特	8.40000000000000036	200	《复仇者联盟3：无限战争》是由漫威电影制作的的科幻片。该片由安东尼·罗素、乔·罗素执导，小罗伯特·唐尼、乔什·布洛林、克里斯·埃文斯、克里斯·海姆斯沃斯、斯嘉丽·约翰逊等主演，于2018年5月11日在中国大陆上映。 该片是《复仇者联盟》系列电影的第三部，是漫威电影宇宙的第十九部电影，该片与《雷神3：诸神黄昏》剧情连接，讲述了复仇者联盟和他们的超级英雄盟友们牺牲一切，阻止灭霸毁灭一半宇宙的故事。	/public/img/1.png	2018-02-02 12:23:23+08	2018-02-02 12:23:23+08	1
4	normal	复仇者联盟4	/public/img/1.png	/public/img/1.png	安东尼	安东尼	9.09999999999999964	10	《复仇者联盟3：无限战争》是由漫威电影制作的的科幻片。该片由安东尼·罗素、乔·罗素执导，小罗伯特·唐尼、乔什·布洛林、克里斯·埃文斯、克里斯·海姆斯沃斯、斯嘉丽·约翰逊等主演，于2018年5月11日在中国大陆上映。 该片是《复仇者联盟》系列电影的第三部，是漫威电影宇宙的第十九部电影，该片与《雷神3：诸神黄昏》剧情连接，讲述了复仇者联盟和他们的超级英雄盟友们牺牲一切，阻止灭霸毁灭一半宇宙的故事。	/public/img/1.png	2018-02-02 12:23:23+08	2018-02-02 12:23:23+08	1
7	normal	复仇者联盟7	/public/img/1.png	/public/img/1.png	方法过	史蒂夫	12	12	《复仇者联盟3：无限战争》是由漫威电影制作的的科幻片。该片由安东尼·罗素、乔·罗素执导，小罗伯特·唐尼、乔什·布洛林、克里斯·埃文斯、克里斯·海姆斯沃斯、斯嘉丽·约翰逊等主演，于2018年5月11日在中国大陆上映。 该片是《复仇者联盟》系列电影的第三部，是漫威电影宇宙的第十九部电影，该片与《雷神3：诸神黄昏》剧情连接，讲述了复仇者联盟和他们的超级英雄盟友们牺牲一切，阻止灭霸毁灭一半宇宙的故事。	/public/img/1.png	2018-02-02 12:23:23+08	2018-02-02 12:23:23+08	2
2	normal	复仇者联盟2	/public/img/1.png	/public/img/1.png	安东尼	小罗伯特	8.30000000000000071	200	《复仇者联盟3：无限战争》是由漫威电影制作的的科幻片。该片由安东尼·罗素、乔·罗素执导，小罗伯特·唐尼、乔什·布洛林、克里斯·埃文斯、克里斯·海姆斯沃斯、斯嘉丽·约翰逊等主演，于2018年5月11日在中国大陆上映。 该片是《复仇者联盟》系列电影的第三部，是漫威电影宇宙的第十九部电影，该片与《雷神3：诸神黄昏》剧情连接，讲述了复仇者联盟和他们的超级英雄盟友们牺牲一切，阻止灭霸毁灭一半宇宙的故事。	/public/img/1.png	2018-02-02 12:23:23+08	2018-02-02 12:23:23+08	2
1	normal	复仇者联盟1	/public/img/1.png	/public/img/1.png	安东尼	小罗伯特	8.09999999999999964	100	《复仇者联盟3：无限战争》是由漫威电影制作的的科幻片。该片由安东尼·罗素、乔·罗素执导，小罗伯特·唐尼、乔什·布洛林、克里斯·埃文斯、克里斯·海姆斯沃斯、斯嘉丽·约翰逊等主演，于2018年5月11日在中国大陆上映。 该片是《复仇者联盟》系列电影的第三部，是漫威电影宇宙的第十九部电影，该片与《雷神3：诸神黄昏》剧情连接，讲述了复仇者联盟和他们的超级英雄盟友们牺牲一切，阻止灭霸毁灭一半宇宙的故事。	/public/img/1.png	2018-02-02 12:23:23+08	2018-02-02 12:23:23+08	1
5	normal	复仇者联盟5	/public/img/1.png	/public/img/1.png	恶期望	哈哈哈	10	11	《复仇者联盟3：无限战争》是由漫威电影制作的的科幻片。该片由安东尼·罗素、乔·罗素执导，小罗伯特·唐尼、乔什·布洛林、克里斯·埃文斯、克里斯·海姆斯沃斯、斯嘉丽·约翰逊等主演，于2018年5月11日在中国大陆上映。 该片是《复仇者联盟》系列电影的第三部，是漫威电影宇宙的第十九部电影，该片与《雷神3：诸神黄昏》剧情连接，讲述了复仇者联盟和他们的超级英雄盟友们牺牲一切，阻止灭霸毁灭一半宇宙的故事。	/public/img/1.png	2018-02-02 12:23:23+08	2018-02-02 12:23:23+08	2
6	normal	复仇者联盟6	/public/img/1.png	/public/img/1.png	萨法	史蒂夫	11	12	《复仇者联盟3：无限战争》是由漫威电影制作的的科幻片。该片由安东尼·罗素、乔·罗素执导，小罗伯特·唐尼、乔什·布洛林、克里斯·埃文斯、克里斯·海姆斯沃斯、斯嘉丽·约翰逊等主演，于2018年5月11日在中国大陆上映。 该片是《复仇者联盟》系列电影的第三部，是漫威电影宇宙的第十九部电影，该片与《雷神3：诸神黄昏》剧情连接，讲述了复仇者联盟和他们的超级英雄盟友们牺牲一切，阻止灭霸毁灭一半宇宙的故事。	/public/img/1.png	2018-02-02 12:23:23+08	2018-02-02 12:23:23+08	2
\.


--
-- TOC entry 3284 (class 0 OID 62992)
-- Dependencies: 234
-- Data for Name: filmtypes; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.filmtypes (id, name, created_at, updated_at) FROM stdin;
2	恐怖	2018-10-20 12:22:00+08	2018-10-20 12:22:00+08
1	战争	2018-10-20 12:22:00+08	2018-10-20 12:22:00+08
3	动作	2018-10-20 12:22:00+08	2018-10-20 12:22:00+08
\.


--
-- TOC entry 3290 (class 0 OID 63024)
-- Dependencies: 240
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.games (id, name, description, imgsmall, imgbig, httpurl, created_at, updated_at, gametype_id) FROM stdin;
8	纪念碑谷1	这个游戏很好玩	/public/img/1.png	/public/img/1.png	/public/img/1.png	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08	4
12	纪念碑谷4	这个游戏很好玩	/public/img/1.png	/public/img/1.png	/public/img/1.png	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08	5
15	纪念碑谷7	这个游戏很好玩	/public/img/1.png	/public/img/1.png	/public/img/1.png	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08	5
9	纪念碑谷1	这个游戏很好玩	/public/img/1.png	/public/img/2.png	/public/img/1.png	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08	5
11	纪念碑谷3	这个游戏很好玩	/public/img/1.png	/public/img/2.png	/public/img/1.png	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08	4
10	纪念碑谷2	这个游戏很好玩	/public/img/1.png	/public/img/3.png	/public/img/1.png	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08	6
13	纪念碑谷5	这个游戏很好玩	/public/img/1.png	/public/img/2.png	/public/img/1.png	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08	6
14	纪念碑谷6	这个游戏很好玩	/public/img/1.png	/public/img/3.png	/public/img/1.png	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08	4
\.


--
-- TOC entry 3288 (class 0 OID 63016)
-- Dependencies: 238
-- Data for Name: gametypes; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.gametypes (id, name, created_at, updated_at) FROM stdin;
4	动作	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08
5	策略	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08
6	卡牌	2018-05-30 10:10:10+08	2018-05-30 10:10:10+08
\.


--
-- TOC entry 3273 (class 0 OID 62845)
-- Dependencies: 223
-- Data for Name: mtfis; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.mtfis (id, gw_id, gw_sn, gw_address, gw_port, ssid, apmac, created_at, updated_at) FROM stdin;
1	58:69:6C:ED:EF:10	HMAPA04170500534	192.168.255.1	2060	\N	\N	2018-05-30 14:58:35.182+08	2018-05-31 13:08:23.884+08
\.


--
-- TOC entry 3298 (class 0 OID 63095)
-- Dependencies: 248
-- Data for Name: myfilms; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.myfilms (id, created_at, updated_at, film_id, purchasetype) FROM stdin;
2	2018-05-31 12:00:00+08	2018-05-31 12:00:00+08	2	wx
1	2018-05-31 12:00:00+08	2018-05-31 12:00:00+08	1	zfb
3	2018-05-31 12:00:00+08	2018-05-31 12:00:00+08	5	zfb
\.


--
-- TOC entry 3296 (class 0 OID 63082)
-- Dependencies: 246
-- Data for Name: mynovels; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.mynovels (id, progress, created_at, updated_at, nove_id, purchasetype) FROM stdin;
2	11	2018-05-31 18:00:12+08	2018-05-31 18:00:12+08	2	wx
1	10	2018-05-31 18:00:12+08	2018-05-31 18:00:12+08	1	zfb
3	50	2018-05-31 18:00:12+08	2018-05-31 18:00:12+08	3	zfb
\.


--
-- TOC entry 3275 (class 0 OID 62858)
-- Dependencies: 225
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.news (id, title, description, img_1, img_2, img_3, content, httpurl, created_at, updated_at, type) FROM stdin;
2	新闻题目	海一样辽阔的湖面，玛尼堆连成的轨迹，摇曳的五彩...	/public/img/1.png	/public/img/1.png	/public/img/1.png	新闻内容	http://m2.people.cn/r/MV8wXzExMDYxNTY1XzEyNzRfMTUyNzYzNDY0NA==	2018-05-30 18:00:00+08	2018-05-31 18:00:00+08	notice
1	新闻题目	天上西藏 桃花秘境 信仰的震撼（林芝-然乌-波密-拉萨七日游）	/public/img/1.png	/public/img/1.png	/public/img/1.png	新闻内容	http://m2.people.cn/r/MV8wXzExMDYxNTY1XzEyNzRfMTUyNzYzNDY0NA==	2018-05-30 18:00:00+08	2018-05-30 18:00:00+08	normal
3	新闻题目	海一样辽阔的湖面，玛尼堆连成的轨迹，摇曳的五彩...	/public/img/1.png	/public/img/1.png	/public/img/1.png	新闻内容	http://m2.people.cn/r/MV8wXzExMDYxNTY1XzEyNzRfMTUyNzYzNDY0NA==	2018-05-30 18:00:00+08	2018-05-29 18:00:00+08	normal
\.


--
-- TOC entry 3294 (class 0 OID 63048)
-- Dependencies: 244
-- Data for Name: novels; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.novels (id, name, author, img, price, description, httpurl, created_at, updated_at, noveltype_id) FROM stdin;
2	和名单	韩寒	/public/img/1.png	10	这是小说描述	/public/img/1.png	2018-05-02 10:19:10+08	2018-05-01 10:19:10+08	2
3	和名单	韩寒	/public/img/1.png	11	这是小说描述	/public/img/1.png	2018-05-03 10:19:10+08	2018-05-01 10:19:10+08	1
1	和名单	韩寒	/public/img/1.png	9	本书是微博上最会写故事的人张嘉佳献给你的心动故事。最初以“睡前故事”系列的名义在网上疯狂流传，几天内达到1,500,000次转发，超4亿次阅读，引来电影投资方的巨资抢购，转瞬便签下其中5个故事的电影版权。读过睡前故事的人会知道，这是一本纷杂凌乱的书。像朋友在深夜跟你在叙述，叙述他走过的千山万水。那么多篇章，有温暖的，有明亮的，有落单的，有疯狂的，有无聊的，有胡说八道的。当你辗转失眠时，当你需要安慰时，当你等待列车时，当你赖床慵懒时，当你饭后困顿时，应该都能找到一章合适的。我希望写一本书，你可以留在枕边、放	/public/img/1.png	2018-05-01 10:19:10+08	2018-05-01 10:19:10+08	1
\.


--
-- TOC entry 3292 (class 0 OID 63040)
-- Dependencies: 242
-- Data for Name: noveltypes; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.noveltypes (id, name, created_at, updated_at) FROM stdin;
1	玄幻	2018-10-10 10:01:10+08	2018-10-10 10:01:10+08
2	都市	2018-10-10 10:01:10+08	2018-10-10 10:01:10+08
3	修真	2018-10-10 10:01:10+08	2018-10-10 10:01:10+08
4	情感	2018-10-10 10:01:10+08	2018-10-10 10:01:10+08
\.


--
-- TOC entry 3277 (class 0 OID 62869)
-- Dependencies: 227
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.orders (id, mac, "from", key, val, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3279 (class 0 OID 62880)
-- Dependencies: 229
-- Data for Name: sta; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.sta (id, gw_id, gw_sn, ip, mac, username, usergroup, timeout, auth_deny, created_at, updated_at) FROM stdin;
1	58:69:6C:ED:EF:10	HMAPA04170500534	192.168.0.51	8c:85:90:9d:d4:09	15383830596	\N	\N	f	2018-05-30 14:58:18.798+08	2018-05-31 13:08:23.788+08
\.


--
-- TOC entry 3280 (class 0 OID 62892)
-- Dependencies: 230
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: tibetwifi
--

COPY public.tokens (gw_id, gw_sn, ip, mac, auth, token, username, created_at, updated_at) FROM stdin;
58:69:6C:ED:EF:10	HMAPA04170500534	192.168.0.51	8c:85:90:9d:d4:09	0	58945990-b85c-40a2-9d31-ff95de8ddec1	15383830596	2018-05-30 14:58:39.707+08	2018-05-30 14:58:39.707+08
\.


--
-- TOC entry 3320 (class 0 OID 0)
-- Dependencies: 231
-- Name: counters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.counters_id_seq', 1, false);


--
-- TOC entry 3321 (class 0 OID 0)
-- Dependencies: 235
-- Name: films_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.films_id_seq', 1, true);


--
-- TOC entry 3322 (class 0 OID 0)
-- Dependencies: 233
-- Name: filmtypes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.filmtypes_id_seq', 1, false);


--
-- TOC entry 3323 (class 0 OID 0)
-- Dependencies: 239
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.games_id_seq', 43, true);


--
-- TOC entry 3324 (class 0 OID 0)
-- Dependencies: 237
-- Name: gametypes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.gametypes_id_seq', 6, true);


--
-- TOC entry 3325 (class 0 OID 0)
-- Dependencies: 222
-- Name: mtfis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.mtfis_id_seq', 4, true);


--
-- TOC entry 3326 (class 0 OID 0)
-- Dependencies: 247
-- Name: myfilms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.myfilms_id_seq', 1, false);


--
-- TOC entry 3327 (class 0 OID 0)
-- Dependencies: 245
-- Name: mynovels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.mynovels_id_seq', 1, false);


--
-- TOC entry 3328 (class 0 OID 0)
-- Dependencies: 224
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.news_id_seq', 1, false);


--
-- TOC entry 3329 (class 0 OID 0)
-- Dependencies: 243
-- Name: novels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.novels_id_seq', 1, false);


--
-- TOC entry 3330 (class 0 OID 0)
-- Dependencies: 241
-- Name: noveltypes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.noveltypes_id_seq', 1, false);


--
-- TOC entry 3331 (class 0 OID 0)
-- Dependencies: 226
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- TOC entry 3332 (class 0 OID 0)
-- Dependencies: 228
-- Name: sta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tibetwifi
--

SELECT pg_catalog.setval('public.sta_id_seq', 5, true);


--
-- TOC entry 3127 (class 2606 OID 62911)
-- Name: counters counters_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_pkey PRIMARY KEY (id);


--
-- TOC entry 3129 (class 2606 OID 62913)
-- Name: counters counters_token_key; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_token_key UNIQUE (token);


--
-- TOC entry 3133 (class 2606 OID 63008)
-- Name: films films_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.films
    ADD CONSTRAINT films_pkey PRIMARY KEY (id);


--
-- TOC entry 3131 (class 2606 OID 62997)
-- Name: filmtypes filmtypes_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.filmtypes
    ADD CONSTRAINT filmtypes_pkey PRIMARY KEY (id);


--
-- TOC entry 3137 (class 2606 OID 63032)
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- TOC entry 3135 (class 2606 OID 63021)
-- Name: gametypes gametypes_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.gametypes
    ADD CONSTRAINT gametypes_pkey PRIMARY KEY (id);


--
-- TOC entry 3113 (class 2606 OID 62855)
-- Name: mtfis mtfis_gw_id_key; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.mtfis
    ADD CONSTRAINT mtfis_gw_id_key UNIQUE (gw_id);


--
-- TOC entry 3115 (class 2606 OID 62853)
-- Name: mtfis mtfis_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.mtfis
    ADD CONSTRAINT mtfis_pkey PRIMARY KEY (id);


--
-- TOC entry 3145 (class 2606 OID 63100)
-- Name: myfilms myfilms_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.myfilms
    ADD CONSTRAINT myfilms_pkey PRIMARY KEY (id);


--
-- TOC entry 3143 (class 2606 OID 63087)
-- Name: mynovels mynovels_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.mynovels
    ADD CONSTRAINT mynovels_pkey PRIMARY KEY (id);


--
-- TOC entry 3117 (class 2606 OID 62866)
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- TOC entry 3141 (class 2606 OID 63056)
-- Name: novels novels_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.novels
    ADD CONSTRAINT novels_pkey PRIMARY KEY (id);


--
-- TOC entry 3139 (class 2606 OID 63045)
-- Name: noveltypes noveltypes_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.noveltypes
    ADD CONSTRAINT noveltypes_pkey PRIMARY KEY (id);


--
-- TOC entry 3119 (class 2606 OID 62877)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3121 (class 2606 OID 62891)
-- Name: sta sta_mac_key; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.sta
    ADD CONSTRAINT sta_mac_key UNIQUE (mac);


--
-- TOC entry 3123 (class 2606 OID 62889)
-- Name: sta sta_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.sta
    ADD CONSTRAINT sta_pkey PRIMARY KEY (id);


--
-- TOC entry 3125 (class 2606 OID 62899)
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (token);


--
-- TOC entry 3146 (class 2606 OID 63009)
-- Name: films films_filmtype_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.films
    ADD CONSTRAINT films_filmtype_id_fkey FOREIGN KEY (filmtype_id) REFERENCES public.filmtypes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3147 (class 2606 OID 63033)
-- Name: games games_gametype_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_gametype_id_fkey FOREIGN KEY (gametype_id) REFERENCES public.gametypes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3150 (class 2606 OID 63101)
-- Name: myfilms myfilms_film_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.myfilms
    ADD CONSTRAINT myfilms_film_id_fkey FOREIGN KEY (film_id) REFERENCES public.films(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3149 (class 2606 OID 63088)
-- Name: mynovels mynovels_nove_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.mynovels
    ADD CONSTRAINT mynovels_nove_id_fkey FOREIGN KEY (nove_id) REFERENCES public.novels(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3148 (class 2606 OID 63057)
-- Name: novels novels_noveltype_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tibetwifi
--

ALTER TABLE ONLY public.novels
    ADD CONSTRAINT novels_noveltype_id_fkey FOREIGN KEY (noveltype_id) REFERENCES public.noveltypes(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2018-05-31 19:31:25 CST

--
-- PostgreSQL database dump complete
--

