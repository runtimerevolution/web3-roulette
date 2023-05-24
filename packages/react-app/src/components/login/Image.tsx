import dart from '../../assets/Dart.png';
import trophy from '../../assets/Trophy.png';

const LoginImage = () => {
  return (
    <div className="login-image-container">
      <img className="login-trophy" src={trophy} alt="trophy" />
      <img className="login-dart" src={dart} alt="dart" />
    </div>
  );
};

export default LoginImage;
