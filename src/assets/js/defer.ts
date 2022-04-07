import objectFitImages from 'object-fit-images';

// components読み込み
import { Form } from './components/Form';
import { Link } from './components/Link';
import { NavToggle } from './components/NavToggle';
import { Tel } from './components/Tel';
import { Version } from './components/Version';
import { Vh } from './components/Vh';

objectFitImages('[data-object-fit]');

// components生成
new Form();
new Link();
new NavToggle();
new Tel();
new Version();
new Vh();
